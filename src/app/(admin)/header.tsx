"use client";

import Link from "next/link";
import React, { useState } from "react";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const navigationItems = [
    { href: "/", label: "Volver al portfolio", isPrimary: true },
    { href: "/campaigns", label: "Campañas" },
    { href: "/images", label: "Imágenes" },
    { href: "/profile", label: "Perfil" },
    { href: "/logs", label: "Logs" },
  ];

  const closeSheet = () => setIsOpen(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand area */}
          <div className="flex-shrink-0">
            <span className="text-lg font-semibold text-gray-900">Admin Panel</span>
          </div>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex md:space-x-8 items-center">
            {navigationItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={
                    item.isPrimary
                      ? "text-blue-600 hover:text-blue-800 font-semibold transition-colors px-4 py-2 rounded-md border border-blue-600 hover:bg-blue-50"
                      : "text-gray-700 hover:text-blue-600 font-medium transition-colors px-3 py-2 rounded-md hover:bg-gray-50"
                  }
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Abrir menú</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Menú de navegación</SheetTitle>
                  <SheetDescription>Accede a las diferentes secciones del panel de administración</SheetDescription>
                </SheetHeader>
                <nav className="mt-6">
                  <ul className="space-y-4">
                    {navigationItems.map((item) => (
                      <li key={item.href}>
                        <SheetClose asChild>
                          <Link
                            href={item.href}
                            onClick={closeSheet}
                            className={
                              item.isPrimary
                                ? "block w-full text-left text-blue-600 hover:text-blue-800 font-semibold transition-colors px-4 py-3 rounded-md border border-blue-600 hover:bg-blue-50"
                                : "block w-full text-left text-gray-700 hover:text-blue-600 font-medium transition-colors px-4 py-3 rounded-md hover:bg-gray-50"
                            }
                          >
                            {item.label}
                          </Link>
                        </SheetClose>
                      </li>
                    ))}
                  </ul>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
}
