// src/pages/AboutPage.jsx
export default function AboutPage() {
  return (
    <section className="space-y-12 px-6 py-16 max-w-4xl mx-auto text-center">
      <h1 className="text-4xl font-bold tracking-tight">Who We Are</h1>

      <p className="text-lg opacity-80">
        Ocubyte is a digital product studio that helps visionary brands create,
        automate, and scale smarter.
      </p>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">What Drives Us?</h2>
        <p className="opacity-70">
          We believe that tech should feel like magic. That every line of code
          should carry meaning. That design isn’t just aesthetic — it’s a language.
        </p>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">We Byte Hard.</h2>
        <p className="opacity-70">
          It’s not just our mantra — it’s how we build. With grit, heart, and a touch of rebellion.
        </p>
      </div>
    </section>
  );
}
