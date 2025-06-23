// src/pages/Automations.jsx
import { useTheme } from "../context/ThemeContext";

export default function Automation() {
  const { theme } = useTheme();

  const bgClass = theme === "glass" ? "bg-white/10" : theme === "dark" ? "bg-[#111827]" : "bg-white";
  const textClass = theme === "glass" ? "text-white" : theme === "dark" ? "text-white" : "text-ocubyte-primary";

  return (
    <section className={`min-h-screen ${bgClass} ${textClass} p-8 transition`}>
      <h1 className="text-4xl font-bold mb-4">Automation Services</h1>
      <p className="max-w-xl text-lg">
        Streamline your business with smart content automation and internal workflow systems.  
      </p>
    </section>
  );
}
