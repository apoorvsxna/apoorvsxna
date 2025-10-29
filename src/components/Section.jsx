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
      className="flex flex-col items-center gap-2 transition-all duration-500 ease-out"
      style={style}
    >
      {/* Section Icon */}
      <div
        className={`
          w-16 h-16 flex items-center justify-center
          transition-all duration-300
          ${isActive ? 'text-white scale-110' : 'text-white/50 scale-100'}
        `}
        style={{ zIndex: 50 }}
      >
        {getIcon(section.icon, { size: 40, strokeWidth: 1.5 })}
      </div>

      {/* Section Label */}
      <div
        className={`
          text-sm font-light whitespace-nowrap
          transition-all duration-300
          ${isActive ? 'text-white opacity-100' : 'text-white/50 opacity-70'}
        `}
      >
        {section.name}
      </div>
    </div>
  );
};
