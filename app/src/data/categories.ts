import {
  GraduationCap,
  Users,
  PiggyBank,
  Home,
  FileText,
  Flag,
  Sun,
  type LucideIcon,
} from "lucide-react";

export type CategoryMeta = {
  icon: LucideIcon;
  accent: "amber" | "signal" | "violet";
};

// A restrained 3-hue palette reused across categories (icon shape does most of
// the differentiating work, not a wide color wheel).
export const categoryMeta: Record<string, CategoryMeta> = {
  Academics: { icon: GraduationCap, accent: "signal" },
  Extracurriculars: { icon: Users, accent: "amber" },
  "Financial Literacy Awareness": { icon: PiggyBank, accent: "amber" },
  "Financial Aid": { icon: PiggyBank, accent: "amber" },
  "Family/Mindset": { icon: Home, accent: "violet" },
  Applications: { icon: FileText, accent: "signal" },
  Decision: { icon: Flag, accent: "violet" },
  Summer: { icon: Sun, accent: "amber" },
};

export const categoryOrder = [
  "Academics",
  "Extracurriculars",
  "Financial Literacy Awareness",
  "Financial Aid",
  "Applications",
  "Family/Mindset",
  "Decision",
  "Summer",
];

export const accentClasses: Record<CategoryMeta["accent"], { text: string; bg: string; border: string }> = {
  amber: { text: "text-ember", bg: "bg-ember/10", border: "border-ember/30" },
  signal: { text: "text-signal", bg: "bg-signal/10", border: "border-signal/30" },
  violet: { text: "text-[#a89cf0]", bg: "bg-[#a89cf0]/10", border: "border-[#a89cf0]/30" },
};
