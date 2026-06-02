export function Logo({ className = 'w-12 h-12' }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className} group`}>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-700 rounded-full" />
      <img
        src="/logo_play.png"
        alt=""
        draggable={false}
        className="relative z-10 w-full h-full object-contain logo-spin mix-blend-screen select-none"
      />
    </div>
  );
}
