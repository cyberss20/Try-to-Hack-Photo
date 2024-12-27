import { SocialMediaResult } from '../types';

interface ResultsListProps {
  results: SocialMediaResult[];
  matchConfidence: number;
}

const ResultsList: React.FC<ResultsListProps> = ({ results, matchConfidence }) => {
  if (results.length === 0) return null;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Found Matches</h2>
        <div className="text-sm text-gray-600">
          Overall Match Confidence: {(matchConfidence * 100).toFixed(1)}%
        </div>
      </div>
      <div className="space-y-4">
        {results.map((result, index) => (
          <div key={index} className="border-b pb-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">{result.platform}</h3>
              <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {(result.confidence * 100).toFixed(1)}% match
              </span>
            </div>
            <a 
              href={result.profileUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline block mt-2"
            >
              View Profile
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultsList;