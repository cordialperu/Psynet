import { Link, useLocation } from "wouter";
import { Menu, Leaf, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function NavbarV2() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Inicio" },
    { href: "/explore", label: "Explorar" },
    { href: "/how-it-works", label: "Cómo Funciona" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-sage-200 shadow-sm">
      <div className="max-w-7xl mx-auto flex h-20 items-center justify-between px-4 md:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/">
          <a className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-sage-500 to-moss-600 rounded-2xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-serif text-2xl font-bold bg-gradient-to-r from-sage-700 to-moss-700 bg-clip-text text-transparent">
                PsycheConecta
              </span>
              <p className="text-xs text-earth-600 -mt-1">Medicina Ancestral</p>
            </div>
          </a>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-2">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <a
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
                  location === link.href 
                    ? "bg-sage-100 text-sage-800" 
                    : "text-earth-700 hover:bg-sage-50 hover:text-sage-700"
                }`}
              >
                {link.label}
              </a>
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-3">
          <ThemeToggle />
          <Link href="/admin/login">
            <a>
              <Button 
                variant="ghost" 
                className="rounded-full text-earth-700 hover:bg-sage-50 hover:text-sage-700"
              >
                <User className="w-4 h-4 mr-2" />
                Guías
              </Button>
            </a>
          </Link>
          <Link href="/admin/register">
            <a>
              <Button className="bg-gradient-to-r from-sage-600 to-moss-600 hover:from-sage-700 hover:to-moss-700 text-white rounded-full px-6 shadow-lg">
                Ofrecer Terapia
              </Button>
            </a>
          </Link>
        </div>

        {/* Mobile Menu */}
        <div className="flex md:hidden items-center space-x-2">
          <ThemeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Menu className="h-5 w-5 text-earth-700" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] bg-white/95 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-gradient-to-br from-sage-500 to-moss-600 rounded-2xl flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="font-serif text-xl font-bold text-earth-900">
                    PsycheConecta
                  </span>
                </div>
              </div>
              
              <nav className="flex flex-col space-y-2">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href}>
                    <a
                      onClick={() => setOpen(false)}
                      className={`px-4 py-3 text-base font-medium rounded-2xl transition-all ${
                        location === link.href 
                          ? "bg-sage-100 text-sage-800" 
                          : "text-earth-700 hover:bg-sage-50"
                      }`}
                    >
                      {link.label}
                    </a>
                  </Link>
                ))}
                
                <div className="pt-4 border-t border-sage-200 space-y-2">
                  <Link href="/admin/login">
                    <a onClick={() => setOpen(false)}>
                      <Button 
                        variant="outline" 
                        className="w-full rounded-full border-sage-300 text-earth-700 hover:bg-sage-50"
                      >
                        <User className="w-4 h-4 mr-2" />
                        Acceso Guías
                      </Button>
                    </a>
                  </Link>
                  <Link href="/admin/register">
                    <a onClick={() => setOpen(false)}>
                      <Button className="w-full bg-gradient-to-r from-sage-600 to-moss-600 hover:from-sage-700 hover:to-moss-700 text-white rounded-full">
                        Ofrecer Terapia
                      </Button>
                    </a>
                  </Link>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

// Export as both NavbarV2 and Navbar for compatibility
export { NavbarV2 as Navbar };
