import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import CloudBackdrop from "../components/CloudBackdrop";
import Logo from "../assets/Logos/Light-Theme_Logo_Ocubyte.svg"


const modes = ["glass", "light", "dark"];

export default function Layout() {
  const [mode, setMode] = useState(
    () => localStorage.getItem("theme") || "glass"
  );

  useEffect(() => {
    document.documentElement.classList.remove(
      ...modes.map((m) => `theme-${m}`)
    );
    document.documentElement.classList.add(`theme-${mode}`);
    localStorage.setItem("theme", mode);
  }, [mode]);

  const cycleMode = () => {
    const nextIndex = (modes.indexOf(mode) + 1) % modes.length;
    setMode(modes[nextIndex]);
  };

  return (
    <div className="relative min-h-screen font-sans flex flex-col transition duration-500">
      {/* Cloud backdrop for glass mode */}
      <CloudBackdrop />

      {/* NAV */}
      <header className="w-full sticky top-0 z-50 px-6 py-4 border-b border-white/10 bg-white/10 backdrop-blur">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <img src={Logo} alt="Ocubyte Logo" className="w-[70px]"/>
          <h1 className="text-xl font-bold tracking-wide">OCUBYTE</h1>
          <nav className="space-x-6 text-sm">
            <a href="#">Home</a>
            <a href="#">Services</a>
            <a href="#">Contact</a>
            <button
              onClick={cycleMode}
              className="ml-6 px-4 py-1 border rounded-md bg-white/10 backdrop-blur hover:bg-white/20"
            >
              {mode.toUpperCase()}
            </button>
          </nav>
        </div>
      </header>

      {/* MAIN */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-6">
        <Outlet />
      </main>

      {/* FOOTER */}
      <footer className="text-center text-xs text-white/60 py-6">
        &copy; {new Date().getFullYear()} Ocubyte — We Byte Hard.
        <nav className="mt-4 flex flex-wrap justify-center gap-4 text-xs text-white/60">
          <a href="/">Home</a>
          <a href="/services">Services</a>
          <a href="/projects">Projects</a>
          <a href="/studio">Studio</a>
          <a href="/automation">Automations</a>
          <a href="/contact">Contact</a>
          <a href="/about">About</a>
        </nav>
      </footer>
    </div>
  );
}
