// src/pages/Studio.jsx
import { useTheme } from "../context/ThemeContext";

export default function Studio() {
  const { theme } = useTheme();

  const bgClass = theme === "glass" ? "bg-white/10" : theme === "dark" ? "bg-[#111827]" : "bg-white";
  const textClass = theme === "glass" ? "text-white" : theme === "dark" ? "text-white" : "text-ocubyte-primary";

  return (
    <section className={`min-h-screen ${bgClass} ${textClass} p-8 transition`}>
      <h1 className="text-4xl font-bold mb-4">Ocubyte Studio</h1>
      <p className="max-w-xl text-lg">
        We help brands craft unforgettable digital experiences through strategic design, product thinking, and visual storytelling.
      </p>
    </section>
  );
}
