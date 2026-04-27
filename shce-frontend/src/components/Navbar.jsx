import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const links = [
    { to: '/', label: 'Home' },
    { to: '/engine', label: 'Engine' },
    { to: '/about', label: 'Docs' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-20 flex items-center"
      style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)' }}>
      <div className="max-w-6xl mx-auto w-full px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="font-display text-3xl uppercase tracking-normal text-charcoal">
          SHCE<span className="text-golden">.</span>
        </Link>

        {/* Center nav */}
        <nav className="hidden sm:flex items-center gap-8">
          {links.map((link) => (
            <Link key={link.to} to={link.to}
              className={`text-sm font-medium transition-colors duration-200
                ${location.pathname === link.to ? 'text-charcoal' : 'text-charcoal/50 hover:text-charcoal'}`}>
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-charcoal/50 hidden sm:inline">v1.0</span>
          <Link to="/engine" className="btn-charcoal !py-2.5 !px-6 !text-sm">
            Launch App
          </Link>
        </div>
      </div>
    </header>
  );
}
