export default function GlassPanel({ title, subtitle, children }) {
  return (
    <div
      className="
        w-full max-w-4xl mx-auto p-8 rounded-2xl
        backdrop-blur-xl border border-white/10
        transition-all shadow-xl
        theme-glass:bg-white/10
        theme-light:bg-white
        theme-dark:bg-ocubyte-dark
        text-ocubyte-primary theme-dark:text-white
      "
    >
      {title && (
        <h2 className="text-3xl font-bold mb-2">
          {title}
        </h2>
      )}
      {subtitle && (
        <p className="text-sm text-white/70 theme-light:text-ocubyte-primary/70 theme-dark:text-white/60 mb-4">
          {subtitle}
        </p>
      )}
      <div className="mt-4">
        {children}
      </div>
    </div>
  )
}
