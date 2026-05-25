import React, { useContext } from 'react';
import { ArrowRight } from 'lucide-react';
import { NAV_LINKS, NavContext } from '../app-shell';

const Navbar: React.FC = () => {
  const { activePath, navigate } = useContext(NavContext);

  return (
    <div
      className="fixed inset-x-0 top-5 z-50 mx-auto flex w-[94%] max-w-6xl items-center justify-center"
      style={{ animation: 'slideDown 0.46s cubic-bezier(0.22, 1, 0.36, 1) 0s both' }}
    >
      <nav className="panel flex w-full flex-col gap-4 rounded-[28px] px-4 py-4 md:flex-row md:items-center md:justify-between md:rounded-full md:px-6 md:py-3">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="flex items-center gap-3 rounded-full text-left transition-transform duration-300 hover:-translate-y-0.5"
        >
          <img
            src="/brand-mark.png"
            alt="Olvara Labs"
            className="h-10 w-10 rounded-full border border-white/70 bg-white/70 object-cover shadow-[0_10px_24px_rgba(16,82,51,0.14)]"
          />
          <span className="flex flex-col leading-none">
            <span className="text-sm font-semibold uppercase tracking-[0.32em] text-[color:var(--color-primary)]">Olvara</span>
            <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.28em] text-[color:var(--color-text-muted)]">Labs</span>
          </span>
        </button>

        <div className="flex items-center justify-between gap-3 md:flex-1 md:justify-end">
          <div className="flex flex-1 items-center justify-center gap-1 rounded-full bg-white/55 p-1 md:flex-none">
            {NAV_LINKS.map((link) => {
              const isActive = activePath === link.id;

              return (
                <button
                  type="button"
                  key={link.id}
                  onClick={() => navigate(link.id)}
                  className={`relative z-10 rounded-full px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] transition-colors duration-150 md:px-5 ${
                    isActive ? 'text-white' : 'text-[color:var(--color-primary)] hover:text-[color:var(--color-text)]'
                  }`}
                >
                  <span
                    className={`absolute inset-0 -z-10 rounded-full bg-[color:var(--color-primary)] transition-opacity duration-150 ${
                      isActive ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                  {link.label}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => navigate('/products')}
            className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-primary)] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white transition-colors duration-150 hover:bg-[color:var(--color-primary-dark)]"
          >
            View Programs
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
