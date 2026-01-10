import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Bell, MessageCircle, Briefcase, Menu, X, User } from 'lucide-react';
import logo from '@/assets/logo.jpg';

export function MarketplaceHeader() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [hasNewAlert, setHasNewAlert] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/marketplace', label: 'Software' },
    { path: '/marketplace/categories', label: 'Categories' },
    { path: '/marketplace/demo', label: 'Demo' },
    { path: '/marketplace/pricing', label: 'Pricing' },
    { path: '/marketplace/careers', label: 'Careers' },
    { path: '/marketplace/support', label: 'Support' },
  ];

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 border-b border-border/50 animate-header-enter transition-all duration-300 ${
          scrolled 
            ? 'py-2 bg-background/95 backdrop-blur-xl shadow-lg' 
            : 'py-3 lg:py-4 glass'
        }`}
      >
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between">
            
            {/* Mobile: Hamburger Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 -ml-2 text-foreground/70 hover:text-foreground transition-colors duration-120"
              aria-label="Toggle menu"
            >
              <div className="relative w-6 h-6">
                <Menu 
                  className={`absolute inset-0 h-6 w-6 transition-all duration-120 ${
                    mobileMenuOpen ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
                  }`} 
                />
                <X 
                  className={`absolute inset-0 h-6 w-6 transition-all duration-120 ${
                    mobileMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'
                  }`} 
                />
              </div>
            </button>

            {/* Logo - Desktop: Full, Mobile: Compact Center */}
            <Link 
              to="/marketplace" 
              className="flex items-center gap-2 lg:gap-3 group animate-fade-up lg:flex-none flex-1 lg:flex-initial justify-center lg:justify-start"
              style={{ animationDelay: '0ms' }}
            >
              <div className="relative">
                <img 
                  src={logo} 
                  alt="Software Vala" 
                  className={`rounded-full object-cover transition-all duration-300 group-hover:shadow-[0_0_20px_hsl(var(--primary)/0.4)] ${
                    scrolled ? 'w-8 h-8 lg:w-10 lg:h-10' : 'w-10 h-10 lg:w-12 lg:h-12'
                  }`}
                />
                <div className="absolute inset-0 rounded-full bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </div>
              <div className={`hidden lg:flex flex-col transition-all duration-300 ${scrolled ? 'scale-95 origin-left' : ''}`}>
                <span className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-200">
                  Software Vala
                </span>
                <span className="text-xs text-muted-foreground">The Name of Trust</span>
              </div>
            </Link>

            {/* Center Menu - Desktop Only */}
            <nav 
              className="hidden lg:flex items-center gap-1 animate-fade-up"
              style={{ animationDelay: '50ms' }}
            >
              {navItems.map((item, index) => (
                <Link 
                  key={item.path}
                  to={item.path} 
                  className={`relative px-4 py-2 text-sm font-medium transition-all duration-150 rounded-lg group ${
                    isActive(item.path) 
                      ? 'text-primary' 
                      : 'text-foreground/70 hover:text-foreground hover:bg-muted/50'
                  }`}
                  style={{ animationDelay: `${100 + index * 30}ms` }}
                >
                  {item.label}
                  <span 
                    className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-primary rounded-full transition-all duration-150 ${
                      isActive(item.path) 
                        ? 'w-3/4 shadow-[0_0_8px_hsl(var(--primary))]' 
                        : 'w-0 group-hover:w-1/2'
                    }`}
                  />
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div 
              className="flex items-center gap-1 lg:gap-2 animate-fade-up"
              style={{ animationDelay: '100ms' }}
            >
              {/* Notification Bell */}
              <Button 
                variant="ghost" 
                size="icon" 
                className={`relative text-foreground/70 hover:text-foreground hover:bg-muted/50 h-9 w-9 ${
                  hasNewAlert ? 'animate-bell-shake' : ''
                }`}
                onClick={() => setHasNewAlert(false)}
              >
                <Bell className="h-5 w-5" />
                {hasNewAlert && (
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive animate-pulse" />
                )}
              </Button>

              {/* Internal Chat */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-foreground/70 hover:text-foreground hover:bg-muted/50 h-9 w-9"
              >
                <MessageCircle className="h-5 w-5" />
              </Button>

              {/* Login - Desktop */}
              <Link to="/auth" className="hidden lg:block">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-foreground/70 hover:text-foreground btn-hover"
                >
                  Login
                </Button>
              </Link>

              {/* Login - Mobile (Icon) */}
              <Link to="/auth" className="lg:hidden">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-foreground/70 hover:text-foreground h-9 w-9"
                >
                  <User className="h-5 w-5" />
                </Button>
              </Link>

              {/* Desktop CTAs */}
              <Link to="/marketplace/demo" className="hidden lg:block">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="relative overflow-hidden border-primary/50 text-primary hover:bg-primary/10 btn-hover animate-cta-glow"
                >
                  <span className="relative z-10">Start Demo</span>
                </Button>
              </Link>

              <Link to="/marketplace/cart" className="hidden lg:block">
                <Button 
                  size="sm" 
                  className="bg-gradient-to-r from-accent to-primary text-primary-foreground shadow-lg hover:shadow-xl btn-hover transition-shadow duration-200"
                >
                  Buy Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile: Sticky CTA Row */}
      <div 
        className={`fixed left-0 right-0 z-40 lg:hidden border-b border-border/30 bg-background/95 backdrop-blur-xl transition-all duration-300 animate-fade-up ${
          scrolled ? 'top-[52px]' : 'top-[60px]'
        }`}
        style={{ animationDelay: '150ms' }}
      >
        <div className="container mx-auto px-4 py-2 flex gap-2">
          <Link to="/marketplace/demo" className="flex-1">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full border-primary/50 text-primary hover:bg-primary/10 active:scale-[0.96] transition-transform"
            >
              Start Demo
            </Button>
          </Link>
          <Link to="/marketplace/cart" className="flex-1">
            <Button 
              size="sm" 
              className="w-full bg-gradient-to-r from-accent to-primary text-primary-foreground active:scale-[0.96] transition-transform"
            >
              Buy Now
            </Button>
          </Link>
        </div>
      </div>

      {/* Mobile: Slide-in Menu Overlay */}
      <div 
        className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-200 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileMenuOpen(false)}
      >
        <div className="absolute inset-0 bg-background/80 backdrop-blur-md" />
      </div>

      {/* Mobile: Slide-in Menu Panel */}
      <nav 
        className={`fixed top-0 left-0 bottom-0 z-50 w-72 max-w-[80vw] bg-background border-r border-border/50 shadow-2xl lg:hidden transition-transform duration-200 ease-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Menu Header */}
        <div className="flex items-center gap-3 p-4 border-b border-border/50">
          <img src={logo} alt="Software Vala" className="w-10 h-10 rounded-full object-cover" />
          <div className="flex flex-col">
            <span className="font-bold text-foreground">Software Vala</span>
            <span className="text-xs text-muted-foreground">The Name of Trust</span>
          </div>
        </div>

        {/* Menu Items */}
        <div className="py-4 overflow-y-auto h-[calc(100%-80px)]">
          {navItems.map((item, index) => (
            <Link 
              key={item.path}
              to={item.path}
              className={`flex items-center px-6 py-3.5 text-base font-medium transition-all duration-150 relative overflow-hidden group ${
                isActive(item.path) 
                  ? 'text-primary bg-primary/10' 
                  : 'text-foreground/80 hover:text-foreground hover:bg-muted/50 active:bg-muted'
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {item.label}
              {isActive(item.path) && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full shadow-[0_0_8px_hsl(var(--primary))]" />
              )}
              {/* Ripple effect placeholder */}
              <span className="absolute inset-0 bg-primary/10 opacity-0 group-active:opacity-100 transition-opacity duration-150" />
            </Link>
          ))}
          
          {/* Divider */}
          <div className="my-4 mx-6 border-t border-border/50" />
          
          {/* Apply for Job */}
          <Link 
            to="/marketplace/careers"
            className="flex items-center gap-3 px-6 py-3.5 text-base font-medium text-foreground/80 hover:text-foreground hover:bg-muted/50 active:bg-muted transition-colors"
          >
            <Briefcase className="h-5 w-5" />
            Apply for Job
          </Link>
        </div>
      </nav>
    </>
  );
}
