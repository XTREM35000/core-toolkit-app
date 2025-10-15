import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Camera, Upload } from 'lucide-react';

interface AvatarUploadProps {
  value: File | null;
  onChange: (file: File | null) => void;
  label?: string;
  className?: string;
}

export const AvatarUpload = ({ value, onChange, label = "Photo de profil", className = "" }: AvatarUploadProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <Label className="text-sm font-semibold flex items-center gap-2">
        <Camera className="h-4 w-4 text-[#128C7E]" />
        {label}
      </Label>

      <div className="flex justify-center">
        <Label htmlFor="avatar" className="cursor-pointer">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden hover:bg-gray-200 transition-colors">
            {value ? (
              <img
                src={URL.createObjectURL(value)}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <Camera className="h-8 w-8 text-gray-400" />
            )}
          </div>
        </Label>
        <input
          id="avatar"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
};
