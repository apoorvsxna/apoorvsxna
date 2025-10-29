import { useXMBNavigation } from '../hooks/useXMBNavigation';
import { Header } from './Header';
import { Section } from './Section';
import { XMBItem, FolderBackIcon } from './XMBItem';
import { MarkdownModal } from './MarkdownModal';
import { MobileControls } from './MobileControls';
import { ChevronLeft, ChevronRight, ChevronUp } from 'lucide-react';

export const XMBContainer = ({ data }) => {
  const {
    sectionIndex,
    itemIndex,
    currentSection,
    currentItems,
    currentItem,
    expandedFolder,
    selectedItem,
    isModalOpen,
    setIsModalOpen,
    canNavigateLeft,
    canNavigateRight,
    navigateLeft,
    navigateRight,
    navigateUp,
    navigateDown,
    selectItem,
    handleEscape,
  } = useXMBNavigation(data);

  // Constants for positioning - using viewport units for consistency
  const HOT_SEAT_X = '35vw'; // Slightly left of center
  const SECTION_SPACING = '12vw'; // Space between section icons (was 160px)
  const SECTION_Y = '10vh'; // Y position of section icons from top (was 100px)
  const ITEM_SPACING = '12vh'; // Vertical space between items (was 120px)
  const HOT_SEAT_ITEM_Y = '50vh'; // Vertically centered
  const SECTION_CUTOFF_THRESHOLD = '20vh'; // Items closer than this to section disappear (was 180px)

  // Calculate section positions
  const getSectionStyle = (index) => {
    const isActive = index === sectionIndex;
    const baseSpacing = window.innerWidth * 0.12; // 12vw in pixels
    let translateX = (index - sectionIndex) * baseSpacing;

    // If folder is expanded, shift active section and all left sections to the left
    if (expandedFolder) {
      if (index <= sectionIndex) {
        translateX -= window.innerWidth * 0.15; // Shift left sections more to the left
      }
    }

    return {
      position: 'absolute',
      left: HOT_SEAT_X,
      top: SECTION_Y,
      transform: `translateX(${translateX}px)`,
      zIndex: 50,
    };
  };

  // Calculate item positions
  const getItemStyle = (index) => {
    const isFocused = index === itemIndex;
    const offset = index - itemIndex;
    
    // Items are positioned relative to hot seat
    const itemSpacing = window.innerHeight * 0.12; // 12vh in pixels
    const translateY = offset * itemSpacing;
    
    // Calculate if item should be hidden (too close to section)
    const sectionCutoff = window.innerHeight * 0.20; // 20vh
    const estimatedItemY = window.innerHeight / 2 + translateY;
    const shouldHide = estimatedItemY < sectionCutoff;
    
    // Z-index: hot seat is highest (20), items above section go below (10), others normal (15)
    let zIndex = 15;
    if (isFocused) {
      zIndex = 20; // Hot seat
    } else if (translateY < 0) {
      zIndex = 10; // Items above section (behind it)
    }

    return {
      position: 'absolute',
      left: expandedFolder ? `calc(${HOT_SEAT_X} + 8vw)` : HOT_SEAT_X,
      top: HOT_SEAT_ITEM_Y,
      transform: `translateY(${translateY}px)`,
      zIndex,
      opacity: shouldHide ? 0 : 1,
      pointerEvents: shouldHide ? 'none' : 'auto',
    };
  };

  // Check if there are hidden items above
  const hasHiddenItemsAbove = currentItems.some((_, index) => {
    const offset = index - itemIndex;
    const itemSpacing = window.innerHeight * 0.12;
    const translateY = offset * itemSpacing;
    const sectionCutoff = window.innerHeight * 0.20;
    const estimatedItemY = window.innerHeight / 2 + translateY;
    return estimatedItemY < sectionCutoff;
  });

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Header */}
      <Header profile={data.profile} />

      {/* Navigation Arrows */}
      {canNavigateLeft && (
        <div className="fixed left-6 top-1/2 -translate-y-1/2 z-40 animate-pulse">
          <ChevronLeft size={32} className="text-white/50" strokeWidth={1.5} />
        </div>
      )}
      {canNavigateRight && (
        <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 animate-pulse">
          <ChevronRight size={32} className="text-white/50" strokeWidth={1.5} />
        </div>
      )}
      
      {/* Up Arrow for hidden items */}
      {hasHiddenItemsAbove && (
        <div 
          className="fixed z-40 flex items-center gap-2"
          style={{
            left: expandedFolder ? `calc(${HOT_SEAT_X} + 20px)` : `calc(${HOT_SEAT_X} - 80px)`,
            top: '240px',
          }}
        >
          <div className="flex flex-col items-center gap-1 animate-pulse">
            <ChevronUp size={24} className="text-white/40" strokeWidth={2} />
            <div className="w-1 h-1 rounded-full bg-white/40"></div>
            <div className="w-1 h-1 rounded-full bg-white/40"></div>
            <div className="w-1 h-1 rounded-full bg-white/40"></div>
          </div>
        </div>
      )}

      {/* Sections */}
      <div className="absolute inset-0">
        {data.sections.map((section, index) => (
          <Section
            key={section.id}
            section={section}
            isActive={index === sectionIndex}
            expandedFolder={expandedFolder}
            style={getSectionStyle(index)}
          />
        ))}
      </div>

      {/* Folder Back Icon (when folder is expanded) */}
      {expandedFolder && (
        <FolderBackIcon
          style={{
            position: 'absolute',
            left: HOT_SEAT_X,
            top: HOT_SEAT_ITEM_Y,
            transform: 'translateX(-120px)',
            zIndex: 25,
          }}
        />
      )}

      {/* Items */}
      <div className="absolute inset-0">
        {currentItems.map((item, index) => (
          <XMBItem
            key={item.id}
            item={item}
            isFocused={index === itemIndex}
            style={getItemStyle(index)}
          />
        ))}
      </div>

      {/* Markdown Modal */}
      <MarkdownModal
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Keyboard hints at bottom - hidden on mobile */}
      <div className="hidden md:block fixed bottom-6 left-1/2 -translate-x-1/2 z-30">
        <div className="text-white/40 text-xs text-center space-y-1">
          <div>Arrow keys to navigate • Enter to select • Esc to go back</div>
        </div>
      </div>

      {/* Mobile Controls */}
      <MobileControls
        onUp={navigateUp}
        onDown={navigateDown}
        onLeft={navigateLeft}
        onRight={navigateRight}
        onEnter={selectItem}
        onBack={handleEscape}
        canNavigateLeft={canNavigateLeft}
        canNavigateRight={canNavigateRight}
        isModalOpen={isModalOpen}
        expandedFolder={expandedFolder}
      />
    </div>
  );
};
