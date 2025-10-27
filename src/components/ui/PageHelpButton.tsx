import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getHelpForPath } from '@/lib/helpMessages';

interface Props {
  pageId?: string;
}

// For contextual help we prefer the centralized helper

const PageHelpButton: React.FC<Props> = ({ pageId }) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const pageLevel = typeof document !== 'undefined' ? (document.body?.dataset?.pageHelp as string | undefined) : undefined;
  const message = pageLevel ?? getHelpForPath(pageId) ?? "Besoin d'aide ? Cliquez pour obtenir des conseils rapides sur cette page.";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {/* Desktop & Mobile - Single consistent button */}
      <button
        aria-label="Aide"
        title="Aide"
        onClick={() => setOpen(!open)}
        className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg ring-1 ring-blue-700/20 cursor-pointer transform-gpu transition-transform duration-150 focus:outline-none focus:ring-2 focus:ring-blue-300 active:translate-y-[1px]"
      >
        <span className="text-sm font-semibold">?</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-72 md:w-80 z-50">
          <Card className="p-3 shadow-lg border">
            <div className="text-sm text-gray-800 mb-3">{message}</div>
            <div className="flex justify-end">
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Compris
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default PageHelpButton;