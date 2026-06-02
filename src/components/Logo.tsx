import React from 'react';

export function Logo({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className} group`}>
      {/* Outer blurred glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-700 rounded-full"></div>
      
      {/* Abstract film strip ring */}
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="absolute inset-0 w-full h-full animate-[spin_15s_linear_infinite] group-hover:animate-[spin_4s_linear_infinite]">
        
        {/* Blue Segment */}
        <path d="M50 15 A35 35 0 0 1 85 50" stroke="#2563eb" strokeWidth="8" strokeLinecap="round" strokeDasharray="15 5" />
        {/* Pink Segment */}
        <path d="M85 50 A35 35 0 0 1 50 85" stroke="#db2777" strokeWidth="8" strokeLinecap="round" strokeDasharray="15 5" />
        {/* Purple Segment */}
        <path d="M50 85 A35 35 0 0 1 15 50" stroke="#7c3aed" strokeWidth="8" strokeLinecap="round" strokeDasharray="15 5" />
        {/* Cyan Segment */}
        <path d="M15 50 A35 35 0 0 1 50 15" stroke="#06b6d4" strokeWidth="8" strokeLinecap="round" strokeDasharray="15 5" />
      </svg>

      {/* Center Hex/Play Button */}
      <div className="relative z-10 w-[45%] h-[45%] bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl transform rotate-45 flex items-center justify-center shadow-lg group-hover:rotate-[225deg] transition-transform duration-700">
          <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent transform -rotate-45 ml-1 drop-shadow-md"></div>
      </div>
    </div>
  );
}
