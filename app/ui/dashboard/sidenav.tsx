"use client";
import Link from "next/link";
import { SIDENAV_LINKS } from "@/app/utils/constant";
import { usePathname } from "next/navigation";

export default function SideNav() {
  const pathname = usePathname();
  console.log("pathname:", pathname);
  return (
    <nav className="bg-gray-800 text-white w-full h-full p-2">
      <ul>
        {SIDENAV_LINKS.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={`mb-1   ${
                pathname === link.href
                  ? "block rounded-lg bg-sky-100 px-3 py-2 font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-sky-200"
                  : "block rounded-lg px-3 py-2 text-gray-200 transition-colors hover:bg-gray-700 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
