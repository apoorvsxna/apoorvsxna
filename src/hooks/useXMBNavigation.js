import { useState, useEffect, useCallback } from 'react';

export const useXMBNavigation = (data) => {
  const [sectionIndex, setSectionIndex] = useState(0);
  const [itemIndex, setItemIndex] = useState(0);
  const [expandedFolder, setExpandedFolder] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Store item positions for each section
  const [sectionItemPositions, setSectionItemPositions] = useState({});

  // Get current section
  const currentSection = data.sections[sectionIndex];
  
  // Get current items (either from section or expanded folder)
  const getCurrentItems = useCallback(() => {
    if (expandedFolder) {
      return expandedFolder.items;
    }
    return currentSection?.items || [];
  }, [currentSection, expandedFolder]);

  const currentItems = getCurrentItems();
  const currentItem = currentItems[itemIndex];

  // Play navigation sound (placeholder for now)
  const playNavigationSound = useCallback(() => {
    // TODO: Add sound file when available
    // const audio = new Audio('/sounds/navigate.mp3');
    // audio.play().catch(() => {});
  }, []);

  // Play selection sound (placeholder for now)
  const playSelectionSound = useCallback(() => {
    // TODO: Add sound file when available
    // const audio = new Audio('/sounds/select.mp3');
    // audio.play().catch(() => {});
  }, []);

  // Navigate left (previous section)
  const navigateLeft = useCallback(() => {
    // Don't allow section navigation when folder is expanded
    if (expandedFolder) {
      return;
    }
    if (sectionIndex > 0) {
      // Save current position
      setSectionItemPositions(prev => ({
        ...prev,
        [currentSection.id]: itemIndex
      }));
      
      const newSectionIndex = sectionIndex - 1;
      const newSectionId = data.sections[newSectionIndex].id;
      
      setSectionIndex(newSectionIndex);
      // Restore previous position or default to 0
      setItemIndex(sectionItemPositions[newSectionId] || 0);
      playNavigationSound();
    }
  }, [sectionIndex, expandedFolder, playNavigationSound, currentSection, itemIndex, sectionItemPositions, data.sections]);

  // Navigate right (next section)
  const navigateRight = useCallback(() => {
    // Don't allow section navigation when folder is expanded
    if (expandedFolder) {
      return;
    }
    if (sectionIndex < data.sections.length - 1) {
      // Save current position
      setSectionItemPositions(prev => ({
        ...prev,
        [currentSection.id]: itemIndex
      }));
      
      const newSectionIndex = sectionIndex + 1;
      const newSectionId = data.sections[newSectionIndex].id;
      
      setSectionIndex(newSectionIndex);
      // Restore previous position or default to 0
      setItemIndex(sectionItemPositions[newSectionId] || 0);
      playNavigationSound();
    }
  }, [sectionIndex, data.sections.length, expandedFolder, playNavigationSound, currentSection, itemIndex, sectionItemPositions]);

  // Navigate up (previous item)
  const navigateUp = useCallback(() => {
    if (itemIndex > 0) {
      setItemIndex(prev => prev - 1);
      playNavigationSound();
    }
  }, [itemIndex, playNavigationSound]);

  // Navigate down (next item)
  const navigateDown = useCallback(() => {
    const items = getCurrentItems();
    if (itemIndex < items.length - 1) {
      setItemIndex(prev => prev + 1);
      playNavigationSound();
    }
  }, [itemIndex, getCurrentItems, playNavigationSound]);

  // Select current item (Enter key)
  const selectItem = useCallback(() => {
    const items = getCurrentItems();
    const item = items[itemIndex];
    
    if (!item) return;

    playSelectionSound();

    if (item.type === 'folder') {
      // Expand folder
      setExpandedFolder(item);
      setItemIndex(0);
    } else if (item.type === 'item') {
      // Open modal with content
      setSelectedItem(item);
      setIsModalOpen(true);
    }
  }, [itemIndex, getCurrentItems, playSelectionSound]);

  // Close modal or collapse folder (Escape key)
  const handleEscape = useCallback(() => {
    if (isModalOpen) {
      setIsModalOpen(false);
      setSelectedItem(null);
    } else if (expandedFolder) {
      setExpandedFolder(null);
      setItemIndex(0);
      playNavigationSound();
    }
  }, [isModalOpen, expandedFolder, playNavigationSound]);

  // Keyboard event handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't handle keys if modal is open (except Escape)
      if (isModalOpen && e.key !== 'Escape') {
        return;
      }

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          navigateLeft();
          break;
        case 'ArrowRight':
          e.preventDefault();
          navigateRight();
          break;
        case 'ArrowUp':
          e.preventDefault();
          navigateUp();
          break;
        case 'ArrowDown':
          e.preventDefault();
          navigateDown();
          break;
        case 'Enter':
          e.preventDefault();
          if (!isModalOpen) {
            selectItem();
          }
          break;
        case 'Escape':
          e.preventDefault();
          handleEscape();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    navigateLeft,
    navigateRight,
    navigateUp,
    navigateDown,
    selectItem,
    handleEscape,
    isModalOpen,
  ]);

  return {
    sectionIndex,
    itemIndex,
    currentSection,
    currentItems,
    currentItem,
    expandedFolder,
    selectedItem,
    isModalOpen,
    setIsModalOpen,
    canNavigateLeft: sectionIndex > 0 || expandedFolder !== null,
    canNavigateRight: sectionIndex < data.sections.length - 1 || expandedFolder !== null,
    // Expose navigation functions for mobile controls
    navigateLeft,
    navigateRight,
    navigateUp,
    navigateDown,
    selectItem,
    handleEscape,
  };
};
