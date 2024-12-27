export interface SocialMediaResult {
  platform: string;
  profileUrl: string;
  confidence: number;
}

export interface FaceDetectionResult {
  landmarks: number[][];
  boundingBox: number[];
}

export interface SearchResult {
  results: SocialMediaResult[];
  matchConfidence: number;
}