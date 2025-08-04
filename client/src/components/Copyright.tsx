import React from 'react';

interface CopyrightProps {
  className?: string;
  variant?: 'fixed' | 'relative';
}

const Copyright: React.FC<CopyrightProps> = ({ 
  className = '', 
  variant = 'fixed' 
}) => {
  const baseClasses = variant === 'fixed' 
    ? 'fixed bottom-4 left-4 z-50' 
    : 'relative w-full';

  return (
    <div className={`${baseClasses} ${className}`}>
      <div className="relative">
        {/* Copyright text */}
        <div className="flex flex-col items-center justify-center py-2 px-3 text-white">
          <div className="text-xs font-medium tracking-wide">
            Copyright © 2025 Mentor Meet
          </div>
          <div className="text-xs font-light tracking-wide">
            All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Copyright; 