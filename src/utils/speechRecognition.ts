/**
 * Web Speech Recognition helper for classroom practice.
 * Listens for the student speaking sentences like "The clown is in the city!" or "The clown is in the town!"
 */

export interface SpeechRecognitionResult {
  transcript: string;
  isMatch: boolean;
  score: number; // 0 to 100
  matchedKeywords: string[];
}

// Window type augmentation for webkitSpeechRecognition
interface IWindow extends Window {
  webkitSpeechRecognition?: any;
  SpeechRecognition?: any;
}

export function isSpeechRecognitionSupported(): boolean {
  const win = window as unknown as IWindow;
  return !!(win.SpeechRecognition || win.webkitSpeechRecognition);
}

export function startListening(
  expectedLocation: 'city' | 'town',
  onResult: (result: SpeechRecognitionResult) => void,
  onError: (errorMsg: string) => void,
  onEnd: () => void
): () => void {
  const win = window as unknown as IWindow;
  const SpeechClass = win.SpeechRecognition || win.webkitSpeechRecognition;

  if (!SpeechClass) {
    onError('Browser does not support Speech Recognition. Use manual test mode!');
    return () => {};
  }

  let recognition: any;
  try {
    recognition = new SpeechClass();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 3;

    recognition.onresult = (event: any) => {
      let bestTranscript = '';
      for (let i = 0; i < event.results.length; ++i) {
        bestTranscript += event.results[i][0].transcript;
      }
      const cleanTranscript = bestTranscript.trim().toLowerCase();
      
      const keywords = ['clown', expectedLocation, 'in', 'the', 'is'];
      const matched = keywords.filter((k) => cleanTranscript.includes(k));

      // Check if target words exist
      const hasClown = cleanTranscript.includes('clown');
      const hasLocation = cleanTranscript.includes(expectedLocation);

      let score = 50;
      if (hasClown && hasLocation) {
        score = 100;
      } else if (hasClown || hasLocation) {
        score = 80;
      } else if (matched.length >= 2) {
        score = 70;
      }

      onResult({
        transcript: bestTranscript,
        isMatch: hasClown && hasLocation,
        score,
        matchedKeywords: matched
      });
    };

    recognition.onerror = (event: any) => {
      onError(event.error || 'Speech recognition error');
    };

    recognition.onend = () => {
      onEnd();
    };

    recognition.start();
  } catch (err: any) {
    onError(err?.message || 'Unable to start microphone');
    return () => {};
  }

  return () => {
    try {
      recognition?.stop();
    } catch {
      // Ignored
    }
  };
}
