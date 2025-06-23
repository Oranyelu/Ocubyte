import { useTheme } from "../context/ThemeContext";

export default function Hero() {
  const { theme } = useTheme();

  const getBackgroundClass = () => {
    switch (theme) {
      case "glass":
        return "bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl";
      case "dark":
        return "bg-ocubyte-dark";
      case "light":
        return "bg-gradient-to-br from-ocubyte-cloud to-white";
      default:
        return "";
    }
  };

  return (
    <section
      className={`relative min-h-[80vh] flex flex-col items-center justify-center text-center px-6 transition-all duration-500 ${getBackgroundClass()}`}
    >
      {/* Optional cloud shimmer for glass theme */}
      {theme === "glass" && (
        <div className="absolute inset-0 animate-cloud-drift bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-white/5 to-transparent opacity-30 blur-3xl pointer-events-none z-0" />
      )}

      <div className="z-10 space-y-4">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          Welcome to{" "}
          <span className="text-ocubyte-accent drop-shadow-md">Ocubyte</span>
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto text-white/80">
          Where smart systems meet human intelligence.
        </p>
        <p className="text-sm uppercase tracking-wider text-ocubyte-accent font-semibold">
          We Byte Hard.
        </p>
      </div>
    </section>
  );
}
