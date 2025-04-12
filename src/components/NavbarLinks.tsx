
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { Bus, Home, Award, UserCircle, Ticket, HeartHandshake, PenLine } from "lucide-react";

interface NavLink {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const NavbarLinks: React.FC = () => {
  const location = useLocation();

  const links: NavLink[] = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: <Home className="h-5 w-5" />,
    },
    {
      href: "/log-trip",
      label: "Log Trip",
      icon: <PenLine className="h-5 w-5" />,
    },
    {
      href: "/tickets",
      label: "Book Ticket",
      icon: <Ticket className="h-5 w-5" />,
    },
    {
      href: "/rewards",
      label: "Rewards",
      icon: <Award className="h-5 w-5" />,
    },
    {
      href: "/donate",
      label: "Donate",
      icon: <HeartHandshake className="h-5 w-5" />,
    },
    {
      href: "/profile",
      label: "Profile",
      icon: <UserCircle className="h-5 w-5" />,
    },
  ];

  return (
    <nav className="hidden md:flex space-x-6">
      {links.map((link) => {
        const isActive = location.pathname === link.href;
        return (
          <Link
            key={link.href}
            to={link.href}
            className={`flex items-center text-sm font-medium transition-colors ${
              isActive
                ? "text-eco-green-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <span className="mr-2">{link.icon}</span>
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
};

export default NavbarLinks;
