import { getIcon } from './Section';
import { Folder as FolderIcon, ChevronRight } from 'lucide-react';

export const XMBItem = ({ item, isFocused, style }) => {
  const hasDescription = item.description && item.description.trim() !== '';
  const isFolder = item.type === 'folder';

  return (
    <div
      className={`
        flex items-center gap-4
        transition-all duration-300 ease-out
        ${isFocused ? 'opacity-100 scale-110' : 'opacity-50 scale-90'}
      `}
      style={style}
    >
      {/* Icon */}
      <div className="flex-shrink-0">
        {isFolder ? (
          <FolderIcon size={isFocused ? 48 : 40} strokeWidth={1.5} className="text-white" />
        ) : (
          <div className="text-white">
            {getIcon(item.icon || 'circle', { 
              size: isFocused ? 48 : 40, 
              strokeWidth: 1.5 
            })}
          </div>
        )}
      </div>

      {/* Text Content */}
      <div className={`flex flex-col ${hasDescription ? 'gap-1' : 'justify-center'}`}>
        {/* Name */}
        <div className={`
          text-white font-medium
          ${isFocused ? 'text-2xl' : 'text-lg'}
          transition-all duration-300
        `}>
          {item.name}
        </div>

        {/* Description - only show when focused */}
        {hasDescription && isFocused && (
          <div className="text-white/70 text-sm font-light">
            {item.description}
          </div>
        )}
      </div>

      {/* Folder Indicator */}
      {isFolder && isFocused && (
        <ChevronRight 
          size={24} 
          className="text-white/70 ml-2" 
          strokeWidth={1.5}
        />
      )}
    </div>
  );
};

export const FolderBackIcon = ({ style }) => {
  return (
    <div
      className="flex items-center justify-center opacity-70"
      style={style}
    >
      <FolderIcon size={48} strokeWidth={1.5} className="text-white" />
    </div>
  );
};
