// src/pages/ContactPage.jsx
export default function ContactPage() {
  return (
    <section className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-8 text-center">Let’s Connect</h1>

      <form className="space-y-6">
        <input
          type="text"
          placeholder="Full Name"
          className="w-full p-3 rounded-md bg-white/10 backdrop-blur border border-white/20"
        />
        <input
          type="email"
          placeholder="Email Address"
          className="w-full p-3 rounded-md bg-white/10 backdrop-blur border border-white/20"
        />
        <select className="w-full p-3 rounded-md bg-white/10 backdrop-blur border border-white/20">
          <option>Project Type</option>
          <option>Branding</option>
          <option>Website</option>
          <option>App</option>
          <option>Automation</option>
          <option>Other</option>
        </select>
        <textarea
          placeholder="Your Message"
          rows="5"
          className="w-full p-3 rounded-md bg-white/10 backdrop-blur border border-white/20"
        />
        <button
          type="submit"
          className="w-full py-3 rounded-md bg-ocubyte-accent hover:bg-ocubyte-primary transition text-white font-bold"
        >
          Send Message
        </button>
      </form>
    </section>
  );
}
