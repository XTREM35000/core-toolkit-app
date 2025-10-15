import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Phone } from 'lucide-react';

interface PhoneInputProps {
  value: string;
  onChange: (phone: string) => void;
  label?: string;
  required?: boolean;
  className?: string;
}

const countryCodes = [
  { code: '+225', country: 'Côte d\'Ivoire', flag: '🇨🇮' },
  { code: '+221', country: 'Sénégal', flag: '🇸🇳' },
  { code: '+224', country: 'Guinée', flag: '🇬🇳' },
  { code: '+226', country: 'Burkina Faso', flag: '🇧🇫' },
  { code: '+223', country: 'Mali', flag: '🇲🇱' },
  { code: '+227', country: 'Niger', flag: '🇳🇪' },
  { code: '+229', country: 'Bénin', flag: '🇧🇯' },
  { code: '+228', country: 'Togo', flag: '🇹🇬' },
  { code: '+233', country: 'Ghana', flag: '🇬🇭' },
  { code: '+234', country: 'Nigeria', flag: '🇳🇬' },
  { code: '+237', country: 'Cameroun', flag: '🇨🇲' },
  { code: '+216', country: 'Tunisie', flag: '🇹🇳' },
  { code: '+212', country: 'Maroc', flag: '🇲🇦' },
  { code: '+213', country: 'Algérie', flag: '🇩🇿' },
  { code: '+961', country: 'Liban', flag: '🇱🇧' }
];

export const PhoneInput = ({ value, onChange, label = "Téléphone", required = false, className = "" }: PhoneInputProps) => {
  const [selectedCode, setSelectedCode] = useState('+225');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Initialiser la valeur par défaut Côte d'Ivoire si aucun value fourni
  useEffect(() => {
    if (!value) {
      onChange('+225');
    } else if (typeof value === 'string') {
      // Si une valeur existe, tenter d'extraire le code
      const match = value.match(/^\+(\d{2,3})/);
      if (match) {
        const code = `+${match[1]}`;
        setSelectedCode(code);
        const rest = value.replace(code, '').replace(/\D/g, '');
        setPhoneNumber(rest);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCodeChange = (code: string) => {
    setSelectedCode(code);
    const fullPhone = code + phoneNumber;
    onChange(fullPhone);
  };

  const handleNumberChange = (number: string) => {
    // Nettoyer le numéro (enlever les espaces et caractères non numériques)
    const cleanNumber = number.replace(/\D/g, '');
    setPhoneNumber(cleanNumber);
    const fullPhone = selectedCode + cleanNumber;
    onChange(fullPhone);
  };

  return (
    <div className={`space-y-1 ${className}`}>
      <Label className="flex items-center gap-1 text-xs">
        <Phone className="h-3 w-3" />
        {label} {required && '*'}
      </Label>
      <div className="flex gap-2">
        <Select value={selectedCode} onValueChange={handleCodeChange}>
          <SelectTrigger className="w-24 h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {countryCodes.map((country) => (
              <SelectItem key={country.code} value={country.code} className="text-xs">
                <span className="mr-2">{country.flag}</span>
                {country.code}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type="tel"
          value={phoneNumber}
          onChange={(e) => handleNumberChange(e.target.value)}
          placeholder="123456789"
          className="h-8 text-sm flex-1 transition-all duration-200 focus:ring-2 focus:ring-[#128C7E]"
        />
      </div>
    </div>
  );
};
