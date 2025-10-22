import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

interface BreadcrumbProps {
  className?: string;
}

const NavigationBreadcrumb: React.FC<BreadcrumbProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const segments = location.pathname.split('/').filter(Boolean);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <nav className={`px-4 py-2 flex items-center gap-4 ${className}`} aria-label="breadcrumb">
      <button onClick={handleBack} className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900">
        <ChevronLeft className="w-4 h-4" />
        <span>Retour</span>
      </button>

      <ol className="flex items-center gap-2 text-xs text-gray-500 truncate">
        <li>Accueil</li>
        {segments.map((seg, idx) => (
          <li key={idx} className="truncate after:content-['/'] after:mx-2 last:after:content-['']">
            {decodeURIComponent(seg)}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default NavigationBreadcrumb;
