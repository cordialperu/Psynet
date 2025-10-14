import { Link, useLocation } from "wouter";
import { Menu, Leaf, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function NavbarPsychedelic() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "🏠 Inicio" },
    { href: "/explore", label: "🔮 Explorar" },
    { href: "/how-it-works", label: "✨ Cómo Funciona" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-purple-900/90 via-indigo-900/90 to-purple-900/90 backdrop-blur-xl border-b-2 border-pink-500/30 shadow-lg shadow-purple-500/20">
      <div className="max-w-7xl mx-auto flex h-20 items-center justify-between px-4 md:px-6 lg:px-8">
        {/* Logo - Mystical */}
        <Link href="/">
          <a className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity animate-pulse"></div>
              <div className="relative w-12 h-12 bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center transform group-hover:rotate-180 transition-transform duration-700">
                <Leaf className="w-7 h-7 text-white" />
              </div>
            </div>
            <div>
              <span className="font-serif text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
                PsycheConecta
              </span>
              <p className="text-xs text-purple-300 -mt-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Medicina Ancestral
              </p>
            </div>
          </a>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-2">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <a
                className={`px-6 py-2 rounded-full text-base font-medium transition-all duration-300 ${
                  location === link.href
                    ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/50"
                    : "text-purple-200 hover:text-white hover:bg-white/10"
                }`}
              >
                {link.label}
              </a>
            </Link>
          ))}
        </nav>

        {/* CTA Button */}
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/admin/login">
            <a>
              <Button 
                variant="outline" 
                className="border-2 border-purple-300 text-purple-200 hover:bg-purple-500/20 rounded-full backdrop-blur-sm"
              >
                <User className="w-4 h-4 mr-2" />
                Guías
              </Button>
            </a>
          </Link>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="text-purple-200 hover:bg-purple-500/20 rounded-full"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent 
              side="right" 
              className="w-[300px] bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800 border-l-2 border-pink-500/30"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center space-x-3 mb-8 pb-6 border-b border-purple-300/30">
                  <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center">
                    <Leaf className="w-6 h-6 text-white" />
                  </div>
                  <span className="font-serif text-xl font-bold text-white">
                    PsycheConecta
                  </span>
                </div>

                <nav className="flex flex-col space-y-3 flex-1">
                  {navLinks.map((link) => (
                    <Link key={link.href} href={link.href}>
                      <a
                        onClick={() => setOpen(false)}
                        className={`px-4 py-3 rounded-xl text-base font-medium transition-all ${
                          location === link.href
                            ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg"
                            : "text-purple-200 hover:bg-white/10"
                        }`}
                      >
                        {link.label}
                      </a>
                    </Link>
                  ))}
                </nav>

                <div className="pt-6 border-t border-purple-300/30">
                  <Link href="/admin/login">
                    <a onClick={() => setOpen(false)}>
                      <Button 
                        className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-xl"
                      >
                        <User className="w-4 h-4 mr-2" />
                        Portal de Guías
                      </Button>
                    </a>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export { NavbarPsychedelic as Navbar };
