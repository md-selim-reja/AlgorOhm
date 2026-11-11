import React, { useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { AlgorOhmLogo } from './ui/AlgorOhmLogo';

interface NavbarProps {
  onOpenDemoModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenDemoModal }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '#platforms', label: 'Platforms' },
    { href: '#inspector', label: 'Spec Inspector' },
    { href: '#architecture', label: 'Algor+Ohm Stack' },
    { href: '#field-gallery', label: 'Field Optics' },
    { href: '#roi-configurator', label: 'Fleet ROI Sim' },
    { href: '#research', label: 'Monographs' },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-[#07090E]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Lockup */}
        <a
          href="#"
          className="flex items-center gap-3.5 group focus-visible:outline-2 focus-visible:outline-cyan-400 rounded-lg"
          aria-label="AlgorOhm Robotics Home"
        >
          <div className="relative">
            <AlgorOhmLogo className="w-10 h-10 transition-transform duration-300 group-hover:scale-105" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold tracking-tight text-white font-display">
                ALGOR<span className="text-cyan-400">OHM</span>
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                ROBOTICS
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-400 tracking-wider">
              NEURAL COMPUTE × PHYSICAL ACTUATION
            </span>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-cyan-400 transition-colors focus-visible:outline-2 focus-visible:outline-cyan-400 rounded px-1 py-0.5"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Primary Action CTA */}
        <div className="hidden sm:flex items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenDemoModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider bg-cyan-400 text-slate-950 hover:bg-cyan-300 transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-cyan-300"
          >
            <span>Request Unit Demo</span>
            <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Mobile Menu Trigger */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="lg:hidden p-2 rounded-lg border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 focus-visible:outline-2 focus-visible:outline-cyan-400"
          aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation-drawer"
        >
          {mobileMenuOpen ? (
            <X className="w-5 h-5" aria-hidden="true" />
          ) : (
            <Menu className="w-5 h-5" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <nav
          id="mobile-navigation-drawer"
          aria-label="Mobile Navigation"
          className="lg:hidden border-t border-slate-800 bg-[#0A0E17] px-4 py-5 space-y-3"
        >
          <div className="grid grid-cols-2 gap-2 text-sm">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-slate-900/70 text-slate-200 hover:text-cyan-400 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDemoModal();
              }}
              className="w-full px-4 py-2.5 rounded-lg text-xs font-semibold uppercase bg-cyan-400 text-slate-950 text-center"
            >
              Request Unit Demo
            </button>
          </div>
        </nav>
      )}
    </header>
  );
};
