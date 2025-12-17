"use client";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Globe, Search } from 'lucide-react';

export default function HeaderHome() {
  const [isScrolled, setIsScrolled] = useState(false);
  
  // FASE 1: Transparente cuando estamos quietos
  // FASE 2: Como el buscador cuando scrolleamos
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50); // Cambiar después de 50px de scroll
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: "Inicio", link: "/" },
    { name: "Coches", link: "/buscador" },
    { name: "Ofertas", link: "/ofertas" },
    { name: "Contacto", link: "/contact" },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const CustomNavbarLogo = () => (
    <Link href="/" className="flex items-center space-x-2">
      <div className="flex items-center justify-center h-12">
        <Image src="/logo-200x50.png" alt="MiguelLeón Logo" width={140} height={35} priority />
      </div>
    </Link>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-transparent">
      <Navbar 
        isBlue={isScrolled}
        shrinkOnScroll={true}
        className="transition-all duration-300 bg-transparent"
      >
        {/* Desktop Navigation */}
        <NavBody className="transition-all duration-300">
          <CustomNavbarLogo />
          <NavItems items={navItems} isBlue={false} />
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full hover:bg-white/10 transition-colors duration-200">
              <Search className="h-5 w-5 text-white" />
            </button>
            <button className="p-2 rounded-full hover:bg-white/10 flex items-center gap-2 border border-white/20 px-3 transition-colors duration-200">
              <Globe className="h-5 w-5 text-white" />
              <span className="text-sm text-white">EN</span>
            </button>
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav isBlue={isScrolled}>
          <MobileNavHeader>
            <CustomNavbarLogo />
            <MobileNavToggle 
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(v => !v)}
              isBlue={false}
            />
          </MobileNavHeader>
          <MobileNavMenu 
            isOpen={isMobileMenuOpen} 
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <Link 
                key={idx} 
                href={item.link} 
                className="block px-5 py-4 text-black hover:bg-gray-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </header>
  );
}
