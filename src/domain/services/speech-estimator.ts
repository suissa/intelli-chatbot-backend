type TranscriberModel = 'gpt-4o-transcribe' | 'gpt-4o-mini-transcribe';

export class SpeechEstimator {
  static estimateSpeechTimeInSeconds(text: string): number {
    const words = text.trim().split(/\s+/).length;
    const wordsPerSecond = 2.5;
    const estimatedSeconds = words / wordsPerSecond;
    return Math.round(estimatedSeconds * 10) / 10;
  }

  static estimateTranscriptionTime(text: string, model: TranscriberModel = 'gpt-4o-mini-transcribe'): number {
    const speechTime = this.estimateSpeechTimeInSeconds(text);

    let multiplier: number;
    switch (model) {
      case 'gpt-4o-mini-transcribe':
        multiplier = 0.4; // entre 0.3x e 0.6x
        break;
      case 'gpt-4o-transcribe':
      default:
        multiplier = 1.7; // média entre 1.5x e 2x
        break;
    }

    const estimatedTranscriptionTime = speechTime * multiplier;
    return Math.round(estimatedTranscriptionTime * 10) / 10;
  }

  static estimateTotalProcessingTime(text: string, model: TranscriberModel = 'gpt-4o-mini-transcribe'): {
    speech: number,
    transcription: number,
    total: number
  } {
    const speech = this.estimateSpeechTimeInSeconds(text);
    const transcription = this.estimateTranscriptionTime(text, model);
    const total = speech + transcription;

    return {
      speech,
      transcription,
      total: Math.round(total * 10) / 10
    };
  }
}
