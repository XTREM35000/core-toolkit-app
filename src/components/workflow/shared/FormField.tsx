import { ReactNode } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface FormFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  children?: ReactNode;
}

export const FormField = ({ 
  id, 
  label, 
  value, 
  onChange, 
  type = 'text', 
  required = false,
  placeholder,
  children 
}: FormFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}{required && ' *'}</Label>
      {children || (
        <Input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          placeholder={placeholder}
          className="rounded-lg"
        />
      )}
    </div>
  );
};
