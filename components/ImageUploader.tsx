import React from 'react';
import { Upload } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelected: (base64: string) => void;
  label?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected, label = "Upload Image" }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          onImageSelected(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded text-sm font-bold flex items-center gap-2 transition-colors">
        <Upload size={16} />
        {label}
        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
      </label>
    </div>
  );
};

export default ImageUploader;