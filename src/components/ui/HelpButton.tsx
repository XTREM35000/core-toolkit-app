import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getHelpForPath } from '@/lib/helpMessages';

interface HelpButtonProps {
  pageName?: string; // can be a pathname like '/profile'
  position?: string; // optional extra class for positioning
  overrideMessage?: string;
}

// message resolution is centralized in src/lib/helpMessages.ts

const HelpButton: React.FC<HelpButtonProps> = ({ pageName, position, overrideMessage }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  const defaultMessage = getHelpForPath(pageName);
  // Prefer explicit overrideMessage, then a page-level data attribute (for pages that set it), then defaults
  const pageLevel = typeof document !== 'undefined' ? (document.body?.dataset?.pageHelp as string | undefined) : undefined;
  const message = overrideMessage ?? pageLevel ?? defaultMessage;

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current) return;
      if (e.target instanceof Node && !ref.current.contains(e.target)) setOpen(false);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onEsc);
    };
  }, []);

  return (
    <div ref={ref} className={`relative ${position ?? ''}`}>
      <button
        aria-label="Aide contextuelle"
        title="Aide"
        onClick={() => setOpen((s) => !s)}
        className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg ring-1 ring-blue-700/20 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        <span className="text-sm font-semibold">?</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-72 md:w-80 z-50">
          <Card className="p-3 shadow-lg border">
            <div className="text-sm text-gray-800 mb-3">{message}</div>
            <div className="flex justify-end">
              <Button variant="ghost" onClick={() => setOpen(false)}>Compris</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default HelpButton;
