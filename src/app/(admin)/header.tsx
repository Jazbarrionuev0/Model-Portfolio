import Link from "next/link";
import React from "react";

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ul className="flex flex-col gap-4 sm:gap-0 sm:flex-row sm:space-x-8 h-auto sm:h-16 items-start sm:items-center py-4 sm:py-0">
          <li className="w-full sm:w-auto">
            <Link
              href="/"
              className="block text-center sm:inline-block text-blue-600 hover:text-blue-800 font-semibold transition-colors px-4 py-2 rounded-md border border-blue-600 hover:bg-blue-50"
            >
              Volver al portfolio
            </Link>
          </li>
          <li className="w-full sm:w-auto">
            <Link
              href="/campaigns"
              className="block text-center sm:inline-block w-full text-gray-700 hover:text-blue-600 font-medium transition-colors px-3 py-2 rounded-md hover:bg-gray-50"
            >
              Campañas
            </Link>
          </li>
          <li className="w-full sm:w-auto">
            <Link
              href="/images"
              className="block text-center sm:inline-block w-full text-gray-700 hover:text-blue-600 font-medium transition-colors px-3 py-2 rounded-md hover:bg-gray-50"
            >
              Imágenes
            </Link>
          </li>
          {/* <li className="w-full sm:w-auto">
            <Link href="/profile" className="block text-center sm:inline-block w-full text-gray-700 hover:text-blue-600 font-medium transition-colors px-3 py-2 rounded-md hover:bg-gray-50">
              Perfil
            </Link>
          </li> */}
        </ul>
      </nav>
    </header>
  );
}
