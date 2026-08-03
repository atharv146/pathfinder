import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

export function ArrowLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link href={href} className={`arrow-link ${className}`}>
      {children}
      <ArrowUpRight size={14} className="arrow-link-icon" />
    </Link>
  );
}
