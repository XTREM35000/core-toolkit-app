import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail } from 'lucide-react';

interface EmailInputProps {
  value: string;
  onChange: (email: string) => void;
  label?: string;
  required?: boolean;
  className?: string;
}

const emailDomains = [
  { value: '@gmail.com', label: 'Gmail' },
  { value: '@yahoo.com', label: 'Yahoo' },
  { value: '@yahoo.fr', label: 'Yahoo France' },
  { value: '@outlook.com', label: 'Outlook' },
  { value: '@outlook.fr', label: 'Outlook France' },
  { value: '@hotmail.com', label: 'Hotmail' },
  { value: '@automaster.ci', label: 'AutoMaster CI' },
  { value: '@orange.ci', label: 'Orange CI' },
  { value: '@mtn.ci', label: 'MTN CI' },
  { value: '@moov.ci', label: 'Moov CI' }
];

export const EmailInput = ({ value, onChange, label = "Email", required = false, className = "" }: EmailInputProps) => {
  const [localPart, setLocalPart] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('@gmail.com');

  // Synchroniser l'état interne avec la valeur externe
  useEffect(() => {
    if (typeof value === 'string' && value.includes('@')) {
      const [local, domain] = value.split('@');
      setLocalPart((local || '').toLowerCase());
      if (domain) setSelectedDomain(`@${domain}`);
    }
  }, [value]);

  const handleLocalPartChange = (part: string) => {
    // Empêcher la saisie de caractères spéciaux comme @, supprimer les espaces et forcer en minuscule
    // Support cases where user pastes a full email or includes a domain fragment.
    let input = part || '';

    // If user pasted a full email like 'name@domain.com', split and apply domain selection.
    if (input.includes('@')) {
      const [local, domain] = input.split('@');
      input = local || '';
      if (domain) {
        const domainWithAt = `@${domain.replace(/^@/, '')}`;
        if (emailDomains.some(d => d.value === domainWithAt)) {
          setSelectedDomain(domainWithAt);
        }
      }
    }

    // Remove spaces and stray @ characters
    let cleanPart = input.replace(/[@\s]/g, '').toLowerCase();

    // If user typed a domain-like suffix (eg 'namegmail.com' or 'name.gmail.com'), strip known domain suffixes
    for (const d of emailDomains) {
      const dom = d.value.replace('@', '').toLowerCase();
      if (cleanPart.endsWith(dom)) {
        cleanPart = cleanPart.slice(0, -dom.length);
        // Remove trailing dot if present
        if (cleanPart.endsWith('.')) cleanPart = cleanPart.slice(0, -1);
        break;
      }
    }

    setLocalPart(cleanPart);
    const fullEmail = cleanPart + selectedDomain;
    console.log('📧 EmailInput - Corps changé:', cleanPart, 'Domaine:', selectedDomain, 'Email complet:', fullEmail);
    onChange(fullEmail);
  };

  const handleDomainChange = (domain: string) => {
    setSelectedDomain(domain);
    const fullEmail = (localPart || '').toLowerCase() + domain;
    console.log('📧 EmailInput - Domaine changé:', domain, 'Corps:', localPart, 'Email complet:', fullEmail);
    onChange(fullEmail);
  };

  return (
    <div className={`space-y-1 ${className}`}>
      <Label className="flex items-center gap-1 text-xs">
        <Mail className="h-3 w-3" />
        {label} {required && '*'}
      </Label>
      <div className="flex gap-2">
        <Input
          type="text"
          value={localPart}
          onChange={(e) => handleLocalPartChange(e.target.value)}
          placeholder="nom.prenom (sans espaces)"
          className="h-8 text-sm flex-1 transition-all duration-200 focus:ring-2 focus:ring-[#128C7E]"
        />
        <Select value={selectedDomain} onValueChange={handleDomainChange}>
          <SelectTrigger className="w-32 h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {emailDomains.map((domain) => (
              <SelectItem key={domain.value} value={domain.value} className="text-xs">
                {domain.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
