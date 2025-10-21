import { useState, useId, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Camera } from 'lucide-react';

interface AvatarUploadProps {
  value: File | null;
  onChange: (file: File | null) => void;
  label?: string;
  className?: string;
  id?: string;
}

export const AvatarUpload = ({ value, onChange, label = "Photo de profil", className = "", id }: AvatarUploadProps) => {
  const autoId = useId();
  const inputId = id ?? `avatar-${autoId}`;
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      onChange(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      onChange(null);
      setPreviewUrl(null);
    }
  };

  // cleanup object URL when value changes or component unmounts
  useEffect(() => {
    if (!value) {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
      return;
    }
    const url = previewUrl ?? (value ? URL.createObjectURL(value) : null);
    if (!previewUrl && url) setPreviewUrl(url);
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className={`space-y-2 ${className}`}>
      <Label className="text-sm font-semibold flex items-center gap-2">
        <Camera className="h-4 w-4 text-[#128C7E]" />
        {label}
      </Label>

      <div className="flex justify-center">
        <Label htmlFor={inputId} className="cursor-pointer">
          <input
            id={inputId}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="sr-only"
          />
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden hover:bg-gray-200 transition-colors">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <Camera className="h-8 w-8 text-gray-400" />
            )}
          </div>
        </Label>
      </div>
    </div>
  );
};
