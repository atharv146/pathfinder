"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { createClient } from "@/lib/supabase/client";
import { t as translate, type Lang } from "@/lib/i18n/strings";

/**
 * Language preference.
 *
 * Read order matters: localStorage first so the choice survives for signed-out
 * visitors and applies instantly on load (no flash of English), then the
 * profile once we know who they are. A parent who set Spanish on the signup
 * page should not get English back the moment they log in.
 *
 * Writing goes both ways when signed in, so the preference follows them to a
 * different device — which for this audience often means the phone they share.
 */

const STORAGE_KEY = "pf-lang";

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<Ctx>({
  lang: "en",
  setLang: () => {},
  t: (k) => translate(k, "en"),
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    // 1. Local choice — instant, works signed out.
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "es" || stored === "en") setLangState(stored);
    } catch {
      // Private browsing. Defaulting to English is fine.
    }

    // 2. Profile, if signed in. Deliberately does NOT overwrite a local choice
    //    made in this session — see setLang, which writes both.
    (async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("preferred_language")
        .eq("id", user.id)
        .maybeSingle();

      const pref = data?.preferred_language;
      if (pref === "es" || pref === "en") {
        // Only adopt the stored profile value if this device has no explicit
        // choice — otherwise the toggle they just pressed would snap back.
        let hasLocal = false;
        try {
          hasLocal = !!window.localStorage.getItem(STORAGE_KEY);
        } catch {
          hasLocal = false;
        }
        if (!hasLocal) setLangState(pref);
      }
    })();
  }, []);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Non-fatal; the in-memory state still applies for this session.
    }

    (async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      await supabase
        .from("profiles")
        .update({ preferred_language: next })
        .eq("id", user.id);
    })();
  }, []);

  const t = useCallback((key: string) => translate(key, lang), [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
