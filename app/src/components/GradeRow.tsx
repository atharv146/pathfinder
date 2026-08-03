"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export function GradeRow({
  grade,
  label,
  note,
  index,
}: {
  grade: number;
  label: string;
  note: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        href={`/roadmap/${grade}`}
        className="group flex items-center gap-6 py-6 transition-colors sm:gap-10"
      >
        <span className="font-mono text-xs text-smoke">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="font-display w-16 shrink-0 text-2xl font-semibold text-smoke transition-colors group-hover:text-ember sm:text-3xl">
          {grade}
        </span>
        <span className="flex-1">
          <span className="font-display block text-lg font-semibold transition-colors sm:text-xl">
            {label}
          </span>
          <span className="mt-1 block max-w-md text-sm text-ash opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:text-base">
            {note}
          </span>
        </span>
        <ArrowUpRight
          size={20}
          className="shrink-0 -translate-x-1 translate-y-1 text-smoke opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:text-ember group-hover:opacity-100"
        />
      </Link>
    </motion.div>
  );
}
