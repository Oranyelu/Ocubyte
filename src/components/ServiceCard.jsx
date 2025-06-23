import { cn } from "../utils/cn.jsx"

export default function ServiceCard({ title, description, icon: Icon }) {
  return (
    <div
      className={cn(
        "rounded-xl p-6 shadow-md transition-all duration-300",
        "border border-white/10",
        "bg-white/5 backdrop-blur-sm",
        "dark:bg-ocubyte-dark dark:border-white/5",
        "theme-light:bg-white theme-light:border-ocubyte-primary/10",
        "hover:scale-[1.02] hover:shadow-lg"
      )}
    >
      <div className="mb-4 text-ocubyte-accent text-3xl">
        <Icon />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-white/70 dark:text-white/60 theme-light:text-ocubyte-primary/80">
        {description}
      </p>
    </div>
  )
}
