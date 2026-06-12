interface PersonaAvatarProps {
  name: string
  color: string
  className?: string
  textClassName?: string
}

// Asset-free persona visual: warm duotone gradient with the persona's initial.
// Image files are gitignored in this repo, so avatars must never depend on JPGs.
export default function PersonaAvatar({ name, color, className = '', textClassName = '' }: PersonaAvatarProps) {
  const initial = name.charAt(0).toUpperCase()
  return (
    <div
      aria-hidden="true"
      className={`relative flex items-center justify-center overflow-hidden select-none ${className}`}
      style={{ background: `linear-gradient(140deg, ${color}26 0%, ${color}59 100%)` }}
    >
      <div
        className="absolute -top-1/4 -right-1/4 w-3/4 h-3/4 rounded-full opacity-30"
        style={{ background: `radial-gradient(circle, ${color} 0%, transparent 70%)` }}
      />
      <div
        className="absolute -bottom-1/3 -left-1/4 w-3/4 h-3/4 rounded-full opacity-20"
        style={{ background: `radial-gradient(circle, ${color} 0%, transparent 70%)` }}
      />
      <span
        className={`relative font-display font-semibold ${textClassName}`}
        style={{ color }}
      >
        {initial}
      </span>
    </div>
  )
}
