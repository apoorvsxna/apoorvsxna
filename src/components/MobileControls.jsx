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
      <div className="bg-black/90 backdrop-blur-sm border-t border-white/10 p-4">
        <div className="max-w-md mx-auto">
          {/* Main Navigation Grid */}
          <div className="grid grid-cols-3 gap-3 mb-3">
            {/* Empty top-left */}
            <div></div>
            
            {/* Up */}
            <button
              onClick={onUp}
              className="aspect-square bg-white/10 hover:bg-white/20 active:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
            >
              <ArrowUp size={24} className="text-white" strokeWidth={2} />
            </button>
            
            {/* Empty top-right */}
            <div></div>
            
            {/* Left */}
            <button
              onClick={onLeft}
              disabled={!canNavigateLeft && !expandedFolder}
              className="aspect-square bg-white/10 hover:bg-white/20 active:bg-white/30 rounded-lg flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ArrowLeft size={24} className="text-white" strokeWidth={2} />
            </button>
            
            {/* Enter/Select */}
            <button
              onClick={onEnter}
              className="aspect-square bg-white hover:bg-white/90 active:bg-white/80 rounded-lg flex items-center justify-center transition-colors"
            >
              <Check size={24} className="text-black" strokeWidth={2.5} />
            </button>
            
            {/* Right */}
            <button
              onClick={onRight}
              disabled={!canNavigateRight && !expandedFolder}
              className="aspect-square bg-white/10 hover:bg-white/20 active:bg-white/30 rounded-lg flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ArrowRight size={24} className="text-white" strokeWidth={2} />
            </button>
            
            {/* Empty bottom-left */}
            <div></div>
            
            {/* Down */}
            <button
              onClick={onDown}
              className="aspect-square bg-white/10 hover:bg-white/20 active:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
            >
              <ArrowDown size={24} className="text-white" strokeWidth={2} />
            </button>
            
            {/* Back/Escape */}
            <button
              onClick={onBack}
              className="aspect-square bg-white/10 hover:bg-white/20 active:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
            >
              <X size={24} className="text-white" strokeWidth={2} />
            </button>
          </div>
          
          {/* Labels */}
          <div className="flex justify-center gap-4 text-xs text-white/50">
            <span>Arrow keys to navigate</span>
            <span>•</span>
            <span>✓ to select</span>
            <span>•</span>
            <span>× to go back</span>
          </div>
        </div>
      </div>
    </div>
  );
};
