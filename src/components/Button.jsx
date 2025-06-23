export default function Button({ children, onClick, type = "button", variant = "default" }) {
  const base =
    "inline-flex items-center justify-center rounded-md px-5 py-2 font-medium transition relative overflow-hidden group";

  const variants = {
    default: `
      theme-glass:bg-white/10 
      theme-light:bg-ocubyte-primary 
      theme-dark:bg-white
      theme-glass:text-white 
      theme-light:text-white 
      theme-dark:text-ocubyte-primary
      hover:opacity-90
    `,
    accent: `
      bg-ocubyte-accent text-white
      hover:bg-ocubyte-accent/80
    `,
    outline: `
      border border-white/30
      theme-light:border-ocubyte-primary
      theme-dark:border-white
      text-white
      theme-light:text-ocubyte-primary
      theme-dark:text-white
      hover:bg-white/10
    `,
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${base} ${variants[variant]}`}
    >
      <span className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/30 to-white/10 opacity-0 group-hover:opacity-100 animate-shimmer transition-all duration-1000 rounded-md" />
      <span className="relative z-10">{children}</span>
    </button>
  );
}
