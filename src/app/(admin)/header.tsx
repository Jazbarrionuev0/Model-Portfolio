import Link from "next/link";
import React from "react";

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ul className="flex space-x-8 h-16 items-center">
          <li>
            <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors px-3 py-2 rounded-md hover:bg-gray-50">
              Inicio
            </Link>
          </li>
          <li>
            <Link href="/campaigns" className="text-gray-700 hover:text-blue-600 font-medium transition-colors px-3 py-2 rounded-md hover:bg-gray-50">
              Campañas
            </Link>
          </li>
          <li>
            <Link href="/images" className="text-gray-700 hover:text-blue-600 font-medium transition-colors px-3 py-2 rounded-md hover:bg-gray-50">
              Imágenes
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
