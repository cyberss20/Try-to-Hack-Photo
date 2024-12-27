import { useRef } from 'react';

interface UploadButtonProps {
  onUpload: (file: File) => void;
  isLoading: boolean;
}

const UploadButton: React.FC<UploadButtonProps> = ({ onUpload, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  return (
    <div className="mb-6">
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
        disabled={isLoading}
      >
        {isLoading ? 'Processing...' : 'Upload Photo'}
      </button>
    </div>
  );
};

export default UploadButton;