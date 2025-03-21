"use client";
import { getCookie } from "@/actions/cookie";
import { lato } from "@/fonts/fonts";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function AdminButton() {
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    const checkAdmin = async () => {
      const cookie = await getCookie("auth");
      if (cookie?.value) {
        setIsAdmin(true);
      }
    };
    checkAdmin();
  }, []);
  return (
    <>
      {isAdmin && (
        <Link href="/images">
          <button className="group flex items-center gap-4 text-white/70 hover:text-white transition-colors">
            <span className={`${lato.className} text-xl`}>Administrar Imágenes</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </Link>
      )}
    </>
  );
}
