import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LeftLogo } from './common/LogoGroup';
import {
  Menu,
  X,
  LogOut,
  Award,
  ChevronDown,
  User,
  Activity,
  LogIn,
  Sparkles,
  MessageSquare,
  Film,
  HeartPulse,
  Info,
} from 'lucide-react';

export const Navbar = () => {
  const {
    normalUser,
    logoutUser,
    logout,
    isUserAuthenticated,
    openAuthModal,
  } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleRegisterClick = (e) => {
    if (e) e.preventDefault();
    if (!isUserAuthenticated) {
      openAuthModal('signup', '/register');
    } else {
      navigate('/register');
    }
  };

  // Close dropdown and drawer on route change
  useEffect(() => {
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Your Thoughts', path: '/your-thoughts' },
    { name: "FAQ's", path: '/faqs' },
    { name: 'Udaan', path: '/udaan' },
    { name: 'Wellness Centers', path: '/wellness-centers' },
  ];

  const isActive = (path) => {
    if (path.startsWith('/#')) {
      return location.hash === path.substring(1);
    }
    if (path === '/udaan') {
      return location.pathname === '/udaan' || location.pathname === '/videos';
    }
    return location.pathname === path;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-[var(--glass-bg,#FFFFFF)]/95 backdrop-blur-md border-b border-[var(--glass-border,rgba(11,35,64,0.1))] shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 md:h-20 gap-3 sm:gap-4">
          
          {/* LEFT CORNER: Official Logo & Brand */}
          <div className="flex items-center gap-3 shrink-0 h-full py-2">
            <LeftLogo />
            <div className="hidden xl:block border-l border-[var(--border-color)] pl-3">
              <span className="text-[10px] uppercase tracking-widest font-black text-[var(--orange)] block leading-tight">
                MARATHON 2026
              </span>
              <span className="text-xs font-bold text-[var(--text-primary)] block leading-tight whitespace-nowrap">
                Anti-Drug Movement Run
              </span>
            </div>
          </div>

          {/* CENTER: Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-2.5 xl:gap-4 2xl:gap-6 shrink-0">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-xs xl:text-sm font-bold tracking-wide transition-colors hover:text-[var(--orange)] text-decoration-none flex items-center gap-1.5 whitespace-nowrap ${
                  isActive(link.path)
                    ? 'text-[var(--orange)] font-extrabold'
                    : 'text-[var(--text-primary)] opacity-85'
                }`}
              >
                {link.name === 'About' && (
                  <Info className="w-3.5 h-3.5 text-blue-500 shrink-0 hidden xl:inline-block" />
                )}
                {(link.name === 'Udaan' || link.name === 'Videos') && (
                  <Film className="w-3.5 h-3.5 text-red-500 shrink-0 hidden xl:inline-block" />
                )}
                {link.name === 'Wellness Centers' && (
                  <HeartPulse className="w-3.5 h-3.5 text-rose-500 shrink-0 hidden xl:inline-block" />
                )}
                {link.name === 'Your Thoughts' && (
                  <MessageSquare className="w-3.5 h-3.5 text-[var(--orange)] shrink-0 hidden xl:inline-block" />
                )}
                <span>{link.name}</span>
                {link.name === 'Your Thoughts' && (
                  <span className="hidden xl:inline-flex items-center px-1.5 py-0.2 rounded-full text-[9px] font-black uppercase tracking-wider bg-[var(--orange)]/15 text-[var(--orange)] border border-[var(--orange)]/30">
                    Live
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* RIGHT CORNER: Actions & User Dropdown */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-2 xl:gap-3 shrink-0">
              {/* Registration CTA */}
              <button
                type="button"
                onClick={handleRegisterClick}
                className="btn-primary py-1.5 px-3 lg:px-3.5 text-[11px] xl:text-xs font-black shadow-md flex items-center gap-1.5 hover:scale-[1.02] transition-transform cursor-pointer whitespace-nowrap shrink-0"
              >
                <Award className="w-3.5 h-3.5 shrink-0" />
                <span className="whitespace-nowrap">REGISTER NOW</span>
              </button>

              {/* Logged in User Dropdown */}
              {isUserAuthenticated && normalUser ? (
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <button
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className="flex items-center gap-2 py-1.5 px-3 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] hover:border-[var(--orange)] text-[var(--text-primary)] transition-all font-bold text-xs shadow-sm"
                    >
                      <div className="w-6 h-6 rounded-full bg-[var(--orange)] text-white flex items-center justify-center font-black text-[11px]">
                        {normalUser.fullName ? normalUser.fullName.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <span className="max-w-[100px] truncate">{normalUser.fullName || 'Account'}</span>
                      <ChevronDown className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                    </button>

                    {userDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-60 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl shadow-2xl z-50 animate-in fade-in">
                        {/* User Card */}
                        <div className="px-4 py-2.5 border-b border-[var(--border-color)]">
                          <p className="text-xs font-black text-[var(--text-primary)] truncate">{normalUser.fullName}</p>
                          <p className="text-[11px] text-[var(--text-muted)] font-mono">+91 {normalUser.phone}</p>
                        </div>

                        {/* Dropdown Links */}
                        <div className="py-1">
                          <Link
                            to="/my-activity"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--orange)] text-decoration-none transition-colors"
                          >
                            <Activity className="w-3.5 h-3.5 text-emerald-500" />
                            <span>My Passes & Activity</span>
                          </Link>

                          <Link
                            to="/profile"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--orange)] text-decoration-none transition-colors"
                          >
                            <User className="w-3.5 h-3.5 text-[var(--orange)]" />
                            <span>My Profile</span>
                          </Link>
                        </div>

                        {/* Logout */}
                        <div className="pt-1 border-t border-[var(--border-color)]">
                          <button
                            onClick={() => {
                              setUserDropdownOpen(false);
                              if (logoutUser) logoutUser();
                              else logout();
                              navigate('/');
                            }}
                            className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-500/10 text-left transition-colors"
                          >
                            <LogOut className="w-3.5 h-3.5" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* CHYK Logo */}
                  <div className="flex items-center pl-1 sm:pl-2 border-l border-[var(--border-color)]/60 shrink-0">
                    <Link
                      to="/"
                      className="flex items-center text-decoration-none group cursor-pointer"
                      title="Go to Marathon Home"
                      aria-label="Go to Marathon Home"
                    >
                      <img
                        src="/assets/logos/chyk-logo.png"
                        alt="Chinmaya Yuva Kendra, Adoni"
                        style={{ height: '32px', maxHeight: '32px', width: 'auto', objectFit: 'contain', display: 'block' }}
                        className="hover:scale-105 transition-transform duration-200 shrink-0"
                      />
                    </Link>
                  </div>
                </div>
              ) : (
                /* Unauthenticated state */
                <div className="flex items-center gap-1.5 xl:gap-2.5">
                  <Link
                    to="/login"
                    className="flex items-center gap-1.5 px-3 py-1.5 xl:py-2 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] hover:border-[var(--orange)] text-[var(--text-primary)] text-xs font-bold transition-all text-decoration-none shadow-sm whitespace-nowrap"
                  >
                    <LogIn className="w-3.5 h-3.5 text-[var(--orange)]" />
                    <span>Sign In</span>
                  </Link>

                  <Link
                    to="/signup"
                    className="hidden xl:flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[var(--orange)]/10 border border-[var(--orange)]/30 text-[var(--orange)] hover:bg-[var(--orange)] hover:text-white text-xs font-bold transition-all text-decoration-none whitespace-nowrap"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Sign Up</span>
                  </Link>

                  {/* CHYK Logo at right side of the signup button */}
                  <div className="flex items-center pl-1 sm:pl-2 border-l border-[var(--border-color)]/60 shrink-0">
                    <Link
                      to="/"
                      className="flex items-center text-decoration-none group cursor-pointer"
                      title="Go to Marathon Home"
                      aria-label="Go to Marathon Home"
                    >
                      <img
                        src="/assets/logos/chyk-logo.png"
                        alt="Chinmaya Yuva Kendra, Adoni"
                        style={{ height: '30px', maxHeight: '30px', width: 'auto', objectFit: 'contain', display: 'block' }}
                        className="hover:scale-105 transition-transform duration-200 shrink-0"
                      />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle Button */}
            <div className="flex lg:hidden items-center gap-2">
              <Link
                to="/"
                className="flex items-center text-decoration-none mr-1 shrink-0 cursor-pointer"
                title="Go to Marathon Home"
                aria-label="Go to Marathon Home"
              >
                <img
                  src="/assets/logos/chyk-logo.png"
                  alt="Chinmaya Yuva Kendra, Adoni"
                  style={{ height: '26px', maxHeight: '26px', width: 'auto', objectFit: 'contain', display: 'block' }}
                  className="hover:scale-105 transition-transform duration-200 shrink-0"
                />
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl bg-[var(--bg-tertiary)] text-[var(--text-primary)] border border-[var(--border-color)] focus:outline-none"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[var(--bg-secondary)] border-b border-[var(--border-color)] px-4 pt-3 pb-6 space-y-4 max-h-[85vh] overflow-y-auto shadow-2xl animate-in slide-in-from-top-2">
          
          {/* User Status in Mobile */}
          {isUserAuthenticated && normalUser ? (
            <div className="p-3.5 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 truncate">
                <div className="w-9 h-9 rounded-full bg-[var(--orange)] text-white flex items-center justify-center font-black text-sm">
                  {normalUser.fullName ? normalUser.fullName.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="truncate">
                  <p className="text-xs font-black text-[var(--text-primary)] truncate">{normalUser.fullName}</p>
                  <p className="text-[11px] text-[var(--text-muted)] font-mono">+91 {normalUser.phone}</p>
                </div>
              </div>
              <Link
                to="/my-activity"
                onClick={() => setMobileMenuOpen(false)}
                className="px-2.5 py-1 rounded-xl bg-[var(--orange)]/15 text-[var(--orange)] text-[11px] font-bold text-decoration-none"
              >
                My Passes
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 pt-1">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-xs font-bold text-[var(--text-primary)] text-decoration-none"
              >
                <LogIn className="w-4 h-4 text-[var(--orange)]" />
                <span>Sign In</span>
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[var(--orange)]/15 border border-[var(--orange)]/30 text-xs font-bold text-[var(--orange)] text-decoration-none"
              >
                <Sparkles className="w-4 h-4" />
                <span>Sign Up</span>
              </Link>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="flex flex-col space-y-2 pt-2 border-t border-[var(--border-color)]">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-sm font-bold px-3 py-2.5 rounded-xl text-decoration-none flex items-center justify-between ${
                  isActive(link.path)
                    ? 'bg-[var(--orange)]/10 text-[var(--orange)] font-extrabold'
                    : 'text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  {link.name === 'About' && (
                    <Info className="w-4 h-4 text-blue-500" />
                  )}
                  {(link.name === 'Udaan' || link.name === 'Videos') && (
                    <Film className="w-4 h-4 text-red-500" />
                  )}
                  {link.name === 'Wellness Centers' && (
                    <HeartPulse className="w-4 h-4 text-rose-500" />
                  )}
                  {link.name === 'Your Thoughts' && (
                    <MessageSquare className="w-4 h-4 text-[var(--orange)]" />
                  )}
                  <span>{link.name}</span>
                </span>
                {link.name === 'Your Thoughts' && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[var(--orange)] text-white">
                    Live
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Mobile Bottom CTAs */}
          <div className="pt-3 border-t border-[var(--border-color)] flex flex-col gap-2.5">
            <button
              type="button"
              onClick={(e) => {
                setMobileMenuOpen(false);
                handleRegisterClick(e);
              }}
              className="btn-primary w-full justify-center py-3 font-extrabold text-xs flex items-center gap-2 cursor-pointer"
            >
              <Award className="w-4 h-4" />
              <span>REGISTER FOR MARATHON</span>
            </button>

            {isUserAuthenticated && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (logoutUser) logoutUser();
                  else logout();
                  navigate('/');
                }}
                className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-red-500/10 text-red-500 text-xs font-bold"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
