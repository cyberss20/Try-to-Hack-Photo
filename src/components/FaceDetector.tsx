import { useState } from 'react';
import { detectFace } from '../utils/faceDetection';
import { extractFaceFeatures } from '../utils/faceExtractor';
import { searchSocialMedia } from '../utils/socialMediaSearch';
import { SocialMediaResult } from '../types';
import UploadButton from './UploadButton';
import ResultsList from './ResultsList';

const FaceDetector: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SocialMediaResult[]>([]);
  const [matchConfidence, setMatchConfidence] = useState(0);
  const [error, setError] = useState<string>('');

  const handleImageUpload = async (file: File) => {
    try {
      setIsLoading(true);
      setError('');
      setResults([]);
      setMatchConfidence(0);

      // Validate file size
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        throw new Error('Image size too large. Please use an image under 5MB.');
      }

      // Detect face in the image
      const faceData = await detectFace(file);
      
      if (!faceData) {
        setError('No faces detected in the image. Please try another photo with a clear face.');
        return;
      }

      // Extract face features
      const faceFeatures = await extractFaceFeatures(faceData);
      
      if (!faceFeatures) {
        setError('Could not extract facial features. Please try another photo.');
        return;
      }

      // Search across social media platforms
      const { results: searchResults, matchConfidence: confidence } = await searchSocialMedia(faceFeatures);
      
      if (searchResults.length === 0) {
        setError('No matches found. Try another photo or adjust search criteria.');
        return;
      }

      setResults(searchResults);
      setMatchConfidence(confidence);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(`Error processing image: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Social Media Face Search</h1>
        <p className="text-gray-600">
          Upload a photo to find matching profiles across social media platforms
        </p>
      </div>

      <UploadButton onUpload={handleImageUpload} isLoading={isLoading} />

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <ResultsList results={results} matchConfidence={matchConfidence} />
    </div>
  );
};

export default FaceDetector;