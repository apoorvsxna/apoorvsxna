import { useState, useEffect } from 'react';

export const Header = ({ profile }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).replace(/\//g, '/');
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  return (
    <div className="fixed top-8 right-8 z-50 flex items-center gap-6">
      {/* Profile Picture */}
      <div className="w-12 h-12 rounded-full overflow-hidden border border-white/20">
        <img
          src={import.meta.env.BASE_URL + profile.picture.replace(/^\//, '')}
          alt={profile.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23333" width="100" height="100"/%3E%3Ctext x="50" y="50" text-anchor="middle" dy=".3em" fill="%23fff" font-size="40"%3EAS%3C/text%3E%3C/svg%3E';
          }}
        />
      </div>

      {/* Text Content */}
      <div className="flex flex-col items-end gap-0.5">
        <div className="text-white text-sm font-medium tracking-wide">
          {profile.name}
        </div>
        <div className="text-white/50 text-xs font-light">
          {formatDate(currentTime)} {formatTime(currentTime)}
        </div>
        <a
          href={profile.cvLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/40 text-xs hover:text-white/70 transition-colors mt-1"
        >
          View CV →
        </a>
      </div>
    </div>
  );
};
