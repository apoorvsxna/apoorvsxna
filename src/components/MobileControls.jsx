import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Check, X } from 'lucide-react';

export const MobileControls = ({ 
  onUp, 
  onDown, 
  onLeft, 
  onRight, 
  onEnter, 
  onBack,
  canNavigateLeft,
  canNavigateRight,
  isModalOpen,
  expandedFolder
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="bg-black/95 backdrop-blur-sm border-t border-white/10 px-3 py-2.5 safe-area-bottom">
        <div className="max-w-sm mx-auto">
          {/* Compact Navigation Grid */}
          <div className="grid grid-cols-3 gap-2">
            {/* Empty top-left */}
            <div></div>
            
            {/* Up */}
            <button
              onClick={onUp}
              className="h-12 bg-white/10 hover:bg-white/20 active:bg-white/30 rounded-md flex items-center justify-center transition-colors touch-manipulation"
              aria-label="Navigate up"
            >
              <ArrowUp size={20} className="text-white" strokeWidth={2} />
            </button>
            
            {/* Empty top-right */}
            <div></div>
            
            {/* Left */}
            <button
              onClick={onLeft}
              disabled={!canNavigateLeft && !expandedFolder}
              className="h-12 bg-white/10 hover:bg-white/20 active:bg-white/30 rounded-md flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed touch-manipulation"
              aria-label="Navigate left"
            >
              <ArrowLeft size={20} className="text-white" strokeWidth={2} />
            </button>
            
            {/* Enter/Select */}
            <button
              onClick={onEnter}
              className="h-12 bg-white hover:bg-white/90 active:bg-white/80 rounded-md flex items-center justify-center transition-colors shadow-lg touch-manipulation"
              aria-label="Select"
            >
              <Check size={20} className="text-black" strokeWidth={2.5} />
            </button>
            
            {/* Right */}
            <button
              onClick={onRight}
              disabled={!canNavigateRight && !expandedFolder}
              className="h-12 bg-white/10 hover:bg-white/20 active:bg-white/30 rounded-md flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed touch-manipulation"
              aria-label="Navigate right"
            >
              <ArrowRight size={20} className="text-white" strokeWidth={2} />
            </button>
            
            {/* Empty bottom-left */}
            <div></div>
            
            {/* Down */}
            <button
              onClick={onDown}
              className="h-12 bg-white/10 hover:bg-white/20 active:bg-white/30 rounded-md flex items-center justify-center transition-colors touch-manipulation"
              aria-label="Navigate down"
            >
              <ArrowDown size={20} className="text-white" strokeWidth={2} />
            </button>
            
            {/* Back/Escape */}
            <button
              onClick={onBack}
              className="h-12 bg-white/10 hover:bg-white/20 active:bg-white/30 rounded-md flex items-center justify-center transition-colors touch-manipulation"
              aria-label="Go back"
            >
              <X size={20} className="text-white" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
