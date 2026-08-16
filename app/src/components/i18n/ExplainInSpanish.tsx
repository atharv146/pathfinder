"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

/**
 * The bridge between English articles and a Spanish-speaking reader.
 *
 * This is the deliberate alternative to bulk-translating the guide (see the
 * header of lib/i18n/strings.ts). These articles carry researched claims about
 * aid eligibility and immigration status, where a translation that quietly
 * turns "may qualify" into "qualifies" would do real harm to the families most
 * exposed to it. So instead of rewriting verified content with no bilingual
 * reviewer, we hand the reader to the AI, which explains it conversationally
 * in Spanish and can take follow-up questions.
 *
 * It says plainly that this is an explanation, not an official translation —
 * a parent deciding something financial deserves to know which one they have.
 */
export function ExplainInSpanish({ title }: { title: string }) {
  const { lang, t } = useLanguage();

  const question = encodeURIComponent(
    `Explícame en español el artículo de PathFinder titulado "${title}". Resume los puntos principales y dime qué significan para mi familia.`
  );

  return (
    <div className="mt-6 rounded-xl border border-accent/30 bg-accent/[0.05] px-5 py-4">
      {lang === "en" && (
        <p className="micro mb-2 text-accent">¿Prefiere leer en español?</p>
      )}

      <p className="text-[0.88rem] leading-relaxed text-ash">
        {t("contentInEnglishBody")}
      </p>

      <Link
        href={`/ask-ai?q=${question}`}
        className="mt-4 inline-block rounded-full bg-accent px-5 py-2.5 text-[0.85rem] font-semibold text-ink"
      >
        {t("explainInSpanish")}
      </Link>

      <p className="mt-3 text-[0.78rem] leading-relaxed text-smoke">
        {t("explainHelp")}
      </p>
    </div>
  );
}
