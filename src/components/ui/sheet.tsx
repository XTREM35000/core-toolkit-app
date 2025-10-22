import * as SheetPrimitive from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

const Sheet = SheetPrimitive.Root;

const SheetTrigger = SheetPrimitive.Trigger;

const SheetClose = SheetPrimitive.Close;

const SheetPortal = SheetPrimitive.Portal;

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className,
    )}
    {...props}
    ref={ref}
  />
));
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

const sheetVariants = cva(
  "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-200 data-[state=open]:duration-250",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom:
          "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-full border-r data-[state=closed]:slide-out-to-left-full data-[state=open]:slide-in-from-left-full sm:max-w-sm",
        right:
          "inset-y-0 right-0 h-full w-full border-l data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-right-full sm:max-w-sm",
      },
    },
    defaultVariants: {
      side: "right",
    },
  },
);

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {
  /** Optional callback invoked when the sheet should close (e.g. after swipe) */
  onClose?: () => void;
}

const SheetContent = React.forwardRef<React.ElementRef<typeof SheetPrimitive.Content>, SheetContentProps>(
  ({ side = "right", className, children, onClose, ...props }, ref) => {
    const contentRef = React.useRef<HTMLElement | null>(null);
    const draggingRef = React.useRef(false);
    const startXRef = React.useRef(0);
    const currentTranslateRef = React.useRef(0);

    // helper to set both forwarded ref and local ref
    const setRefs = (el: HTMLElement | null) => {
      contentRef.current = el;
      if (!ref) return;
      // cast the forwarded ref to a compatible callback/ref type so we can pass HTMLElement | null
      if (typeof ref === "function") (ref as React.RefCallback<HTMLElement | null>)(el);
      else (ref as React.MutableRefObject<any>).current = el;
    };

    const handlePointerDown: React.PointerEventHandler = (e) => {
      // Only primary button
      if (e.pointerType === "mouse" && e.button !== 0) return;
      draggingRef.current = true;
      startXRef.current = e.clientX;
      try {
        contentRef.current?.setPointerCapture(e.pointerId);
      } catch (err) {
        // ignore
      }
      if (contentRef.current) contentRef.current.style.transition = "none";
    };

    const handlePointerMove: React.PointerEventHandler = (e) => {
      if (!draggingRef.current) return;
      const deltaX = e.clientX - startXRef.current;
      // For left side sheet, only allow negative translate (swipe left)
      // For right side sheet, only allow positive translate (swipe right)
      const translate = side === "left" ? Math.min(0, deltaX) : Math.max(0, deltaX);
      currentTranslateRef.current = translate;
      if (contentRef.current) contentRef.current.style.transform = `translateX(${translate}px)`;
    };

    const handlePointerUp: React.PointerEventHandler = (e) => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      try {
        contentRef.current?.releasePointerCapture(e.pointerId);
      } catch (err) {
        // ignore
      }

      const thresholdPx = 120; // px to trigger close
      const translate = currentTranslateRef.current;
      const shouldClose = side === "left" ? translate < -thresholdPx : translate > thresholdPx;

      if (contentRef.current) contentRef.current.style.transition = "transform 200ms ease";

      if (shouldClose) {
        const width = contentRef.current ? contentRef.current.offsetWidth : 0;
        const endTranslate = side === "left" ? -width : width;
        if (contentRef.current) contentRef.current.style.transform = `translateX(${endTranslate}px)`;
        // wait for animation to finish then call onClose
        window.setTimeout(() => {
          onClose?.();
          // reset transform for next open
          if (contentRef.current) contentRef.current.style.transform = "";
        }, 200);
      } else {
        // reset
        if (contentRef.current) contentRef.current.style.transform = "";
      }
    };

    return (
      <SheetPortal>
        <SheetOverlay />
        <SheetPrimitive.Content
          ref={setRefs}
          className={cn(sheetVariants({ side }), className)}
          onPointerDown={(e) => {
            handlePointerDown(e);
            // allow any user-provided handler
            (props as any).onPointerDown?.(e);
          }}
          onPointerMove={(e) => {
            handlePointerMove(e);
            (props as any).onPointerMove?.(e);
          }}
          onPointerUp={(e) => {
            handlePointerUp(e);
            (props as any).onPointerUp?.(e);
          }}
          // allow vertical scrolling while capturing horizontal drags
          style={{ touchAction: "pan-y" } as React.CSSProperties}
          {...props}
        >
          {children}
          <SheetPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity data-[state=open]:bg-secondary hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </SheetPrimitive.Close>
        </SheetPrimitive.Content>
      </SheetPortal>
    );
  },
);
SheetContent.displayName = SheetPrimitive.Content.displayName;

const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-2 text-center sm:text-left", className)} {...props} />
);
SheetHeader.displayName = "SheetHeader";

const SheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
);
SheetFooter.displayName = "SheetFooter";

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title ref={ref} className={cn("text-lg font-semibold text-foreground", className)} {...props} />
));
SheetTitle.displayName = SheetPrimitive.Title.displayName;

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
));
SheetDescription.displayName = SheetPrimitive.Description.displayName;

export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetOverlay,
  SheetPortal,
  SheetTitle,
  SheetTrigger,
};
