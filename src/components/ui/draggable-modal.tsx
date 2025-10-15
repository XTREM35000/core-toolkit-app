import * as React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { X, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface DraggableModalProps {
  trigger: React.ReactNode;
  title: string;
  description?: string;
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

export function DraggableModal({
  trigger,
  title,
  description,
  children,
  open,
  onOpenChange,
  className
}: DraggableModalProps) {
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 });
  const [isScrolling, setIsScrolling] = React.useState(false);
  const [scrollStart, setScrollStart] = React.useState({ y: 0, scrollTop: 0 });
  const [modalSize, setModalSize] = React.useState({ width: 0, height: 0 });

  const modalRef = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);

  // Update modal size when it opens and reset position
  React.useEffect(() => {
    if (open && modalRef.current) {
      const rect = modalRef.current.getBoundingClientRect();
      setModalSize({ width: rect.width, height: rect.height });
      // Reset position to center when opening
      setPosition({ x: 0, y: 0 });
    }
  }, [open]);

  // Handle drag start
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).closest('[data-drag-handle]')) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  // Handle scroll start
  const handleScrollMouseDown = (e: React.MouseEvent) => {
    if (contentRef.current) {
      setIsScrolling(true);
      setScrollStart({
        y: e.clientY,
        scrollTop: contentRef.current.scrollTop
      });
    }
  };

  // Handle mouse move
  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = e.clientX - dragStart.x;
        const newY = e.clientY - dragStart.y;

        // Constrain to viewport with proper modal dimensions
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const modalWidth = modalSize.width || 500; // fallback width
        const modalHeight = modalSize.height || 400; // fallback height

        const maxX = Math.max(0, viewportWidth - modalWidth);
        const maxY = Math.max(0, viewportHeight - modalHeight);

        setPosition({
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(0, Math.min(newY, maxY))
        });
      } else if (isScrolling && contentRef.current) {
        const deltaY = e.clientY - scrollStart.y;
        contentRef.current.scrollTop = scrollStart.scrollTop - deltaY;
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsScrolling(false);
    };

    if (isDragging || isScrolling) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isScrolling, dragStart, scrollStart, position, modalSize]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent
        ref={modalRef}
        className={cn(
          "fixed inset-0 z-50 grid w-full max-w-lg m-auto gap-4 border bg-gradient-card p-0 shadow-elegant duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg",
          className
        )}
        style={isDragging ? { transform: `translate(${position.x}px, ${position.y}px)` } : undefined}
        onMouseDown={handleMouseDown}
      >
        {/* Drag Handle */}
        <div
          data-drag-handle
          className={`flex items-center justify-between p-6 pb-0 transition-colors ${isDragging ? 'cursor-grabbing bg-muted/20' : 'cursor-move hover:bg-muted/10'
            }`}
        >
          <DialogHeader className="flex-1">
            <DialogTitle className="text-xl font-semibold bg-gradient-primary bg-clip-text text-transparent">
              {title}
            </DialogTitle>
            {description && (
              <DialogDescription className="text-muted-foreground">
                {description}
              </DialogDescription>
            )}
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
            <DialogTrigger asChild>
              <button className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
                <X className="h-4 w-4" />
                <span className="sr-only">Fermer</span>
              </button>
            </DialogTrigger>
          </div>
        </div>

        {/* Scrollable Content */}
        <div
          ref={contentRef}
          className={`px-6 pb-6 max-h-[60vh] overflow-y-auto scrollbar-hide transition-colors ${isScrolling ? 'bg-muted/10' : ''
            }`}
          onMouseDown={handleScrollMouseDown}
          style={{
            cursor: isScrolling ? 'grabbing' : 'grab'
          }}
        >
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}
