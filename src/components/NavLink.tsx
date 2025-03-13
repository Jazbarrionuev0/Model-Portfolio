import Link from "next/link";
import { Button } from "./ui/button";
import { lato } from "@/fonts/fonts";


type Props = {
  route: string;
  description: string;
  className?: string | undefined;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | null | undefined;
  onClick?: () => void;
};

const NavLink: React.FC<Props> = ({ route, description, className, variant = "link", onClick }) => {
  return (
    <li onClick={onClick}>
      <Link href={route}>
        <Button
          variant={variant}
          className={`${lato.className} uppercase text-black drop-shadow-2xl hover:no-underline hover:text-white  hover:scale-105  text-2xl no-underline  transition-all ${className}`}
        >
          {description}
        </Button>
      </Link>
    </li>
  );
};

export default NavLink;
