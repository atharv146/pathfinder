/**
 * UI strings, English and Spanish.
 *
 * ── WHAT IS AND ISN'T TRANSLATED HERE, AND WHY ──────────────────────────
 *
 * Translated: navigation, buttons, labels, page headings — the chrome. Short,
 * bounded, and safe to get right.
 *
 * NOT translated: the roadmap items and guide articles. That is a deliberate
 * refusal, not laziness. Those pages carry researched claims about financial
 * aid eligibility, immigration status, and application deadlines, and a
 * machine translation that subtly shifts "may qualify" into "qualifies", or
 * softens a hedge about enforcement risk, would produce exactly the harm this
 * whole app is built to avoid — in the language of the families most exposed
 * to it. Bulk-translating that content without a bilingual reviewer who knows
 * U.S. admissions would be worse than leaving it in English.
 *
 * What we do instead: `ExplainInSpanish` puts every article one click from the
 * AI, which explains it in Spanish, conversationally, and can be asked
 * follow-ups. That reaches the same parent without silently rewriting a
 * verified fact — and it says out loud that it's an explanation, not an
 * official translation.
 *
 * When real translated content does happen, it needs a human bilingual pass
 * and its own freshness stamps (see data/freshness.ts).
 */

export type Lang = "en" | "es";

export const LANGUAGES: { code: Lang; label: string; nativeLabel: string }[] = [
  { code: "en", label: "English", nativeLabel: "English" },
  { code: "es", label: "Spanish", nativeLabel: "Español" },
];

type Dict = Record<string, { en: string; es: string }>;

export const STRINGS: Dict = {
  // Navigation
  navHome: { en: "Home", es: "Inicio" },
  navRoadmap: { en: "Roadmap", es: "Guía por grado" },
  // "Carrera" is the standard term for a degree programme/major across Latin
  // American Spanish — "especialidad" reads as a medical specialism.
  navMajor: { en: "Major", es: "Carrera" },
  navAskAi: { en: "Ask AI", es: "Pregúntale a la IA" },
  navGuide: { en: "Guide", es: "Guía para padres" },
  navTools: { en: "Tools", es: "Herramientas" },
  navActivities: { en: "Activities", es: "Actividades" },
  navAccount: { en: "Account", es: "Mi cuenta" },
  navLogIn: { en: "Log in", es: "Iniciar sesión" },
  navSignUp: { en: "Sign up", es: "Crear cuenta" },
  navLogOut: { en: "Log out", es: "Cerrar sesión" },

  // Account / settings
  language: { en: "Language", es: "Idioma" },
  languageHelp: {
    en: "Changes the app's buttons and labels, and the language the AI answers in.",
    es: "Cambia los botones y las etiquetas de la aplicación, y el idioma en que responde la IA.",
  },
  accountType: { en: "I'm using this as a", es: "Uso esta aplicación como" },
  student: { en: "Student", es: "Estudiante" },
  parent: { en: "Parent or guardian", es: "Padre, madre o tutor" },
  accountTypeHelp: {
    en: "Parent accounts are their own account, not linked to a student's — we don't show anyone your child's progress, and we don't show them yours.",
    es: "Las cuentas de padres son independientes y no están vinculadas a la cuenta de un estudiante. No le mostramos a nadie el progreso de su hijo, ni a su hijo el suyo.",
  },
  saved: { en: "Saved", es: "Guardado" },

  // Explain-in-Spanish affordance
  explainInSpanish: { en: "Explain this in Spanish", es: "Explícame esto en español" },
  explainHelp: {
    en: "Opens Ask AI and asks it to walk through this article in Spanish. It's an explanation, not an official translation.",
    es: "Abre Pregúntale a la IA para explicarte este artículo en español. Es una explicación, no una traducción oficial.",
  },

  // The honest note about content language
  contentInEnglishTitle: {
    en: "This guide is written in English",
    es: "Esta guía está escrita en inglés",
  },
  contentInEnglishBody: {
    en: "We haven't translated the articles themselves yet. These pages contain real rules about financial aid and immigration status, and a rough translation of those could do genuine harm — so we'd rather have a bilingual person check it properly first. In the meantime, the AI can explain any of this in Spanish and answer your questions.",
    es: "Todavía no hemos traducido los artículos. Estas páginas contienen reglas reales sobre ayuda financiera y estatus migratorio, y una traducción apresurada podría causar verdadero daño, así que preferimos que una persona bilingüe la revise bien primero. Mientras tanto, la IA puede explicarle todo esto en español y responder sus preguntas.",
  },
};

export function t(key: keyof typeof STRINGS | string, lang: Lang): string {
  const entry = STRINGS[key as string];
  if (!entry) return key as string;
  return entry[lang] ?? entry.en;
}
