import { lato } from "@/fonts/fonts";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function PortfolioButton() {
  return (
    <Link href="#campaigns">
      <button className="group flex items-center gap-4 text-white/70 hover:text-white transition-colors">
        <span className={`${lato.className} text-xl`}>Ve Mi Portfolio</span>
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </button>
    </Link>
  );
}
