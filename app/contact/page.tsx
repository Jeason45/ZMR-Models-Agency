export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-8">
      <div className="text-center max-w-2xl">
        <h1 className="text-white text-6xl md:text-8xl font-light tracking-wide mb-12">
          Contact
        </h1>
        <div className="space-y-6 text-left">
          <div>
            <p className="text-white/40 text-sm uppercase tracking-wider mb-2">Email</p>
            <a href="mailto:info@zmrmodels.com" className="text-white text-xl font-light hover:opacity-70 transition-opacity">
              info@zmrmodels.com
            </a>
          </div>
          <div>
            <p className="text-white/40 text-sm uppercase tracking-wider mb-2">Instagram</p>
            <a
              href="https://www.instagram.com/zmrmodels/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white text-xl font-light hover:opacity-70 transition-opacity"
            >
              @zmrmodels
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
