import * as LucideIcons from 'lucide-react';

// Helper function to get Lucide icon component by name
export const getIcon = (iconName, props = {}) => {
  // Convert icon name to PascalCase for Lucide
  const iconKey = iconName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
  
  const IconComponent = LucideIcons[iconKey] || LucideIcons.Circle;
  return <IconComponent {...props} />;
};

export const Section = ({ section, isActive, expandedFolder, style }) => {
  return (
    <div
      className="flex flex-col items-center gap-1.5 md:gap-2 transition-all duration-500 ease-out"
      style={style}
    >
      {/* Section Icon */}
      <div
        className={`
          w-12 h-12 md:w-16 md:h-16 flex items-center justify-center
          transition-all duration-300
          ${isActive ? 'text-white scale-110' : 'text-white/50 scale-100'}
        `}
        style={{ zIndex: 50 }}
      >
        {getIcon(section.icon, { 
          size: isActive ? 36 : 32,
          strokeWidth: 1.5,
          className: 'md:w-10 md:h-10'
        })}
      </div>

      {/* Section Label */}
      <div
        className={`
          text-xs md:text-sm font-light whitespace-nowrap
          transition-all duration-300
          ${isActive ? 'text-white opacity-100' : 'text-white/50 opacity-70'}
        `}
      >
        {section.name}
      </div>
    </div>
  );
};
