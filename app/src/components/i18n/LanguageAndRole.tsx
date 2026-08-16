"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { LANGUAGES } from "@/lib/i18n/strings";
import type { AccountType } from "@/lib/db/types";

/**
 * Language and account-type settings.
 *
 * Account type has existed in the schema since migration 0001 and has never
 * had a UI, so every account has silently been a student account. This is that
 * UI.
 *
 * The parent option carries the July 21, 2026 decision as visible copy, not
 * just as a schema comment: parent accounts are standalone and deliberately
 * NOT linked to a student's progress. That protects student autonomy and stops
 * the app becoming a monitoring tool. A parent reading this should understand
 * they're getting their own guidance, not a dashboard of their child.
 */
export function LanguageAndRole() {
  const { lang, setLang, t } = useLanguage();
  const [accountType, setAccountType] = useState<AccountType>("student");
  const [loaded, setLoaded] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return setLoaded(true);

      const { data } = await supabase
        .from("profiles")
        .select("account_type")
        .eq("id", user.id)
        .maybeSingle();

      if (data?.account_type) setAccountType(data.account_type as AccountType);
      setLoaded(true);
    })();
  }, []);

  const saveRole = async (next: AccountType) => {
    setAccountType(next);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    await supabase
      .from("profiles")
      .update({ account_type: next })
      .eq("id", user.id);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  if (!loaded) return null;

  return (
    <div className="mt-10 rounded-lg border border-line bg-panel p-6 sm:p-8">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="display-md text-xl text-chalk">{t("language")}</h2>
        {saved && <span className="micro text-smoke">{t("saved")}</span>}
      </div>

      <p className="mt-2 text-[0.9rem] leading-relaxed text-ash">
        {t("languageHelp")}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {LANGUAGES.map((l) => (
          <button
            key={l.code}
            onClick={() => setLang(l.code)}
            aria-pressed={lang === l.code}
            className={`rounded-full border px-5 py-2.5 text-sm transition-colors ${
              lang === l.code
                ? "border-accent bg-accent/10 text-chalk"
                : "border-line text-ash hover:border-line-bright hover:text-chalk"
            }`}
          >
            {l.nativeLabel}
          </button>
        ))}
      </div>

      <div className="mt-8 border-t border-line pt-6">
        <h3 className="text-[0.95rem] font-semibold text-chalk">
          {t("accountType")}
        </h3>

        <div className="mt-3 flex flex-wrap gap-2">
          {(["student", "parent"] as AccountType[]).map((role) => (
            <button
              key={role}
              onClick={() => saveRole(role)}
              aria-pressed={accountType === role}
              className={`rounded-full border px-5 py-2.5 text-sm transition-colors ${
                accountType === role
                  ? "border-accent bg-accent/10 text-chalk"
                  : "border-line text-ash hover:border-line-bright hover:text-chalk"
              }`}
            >
              {t(role)}
            </button>
          ))}
        </div>

        <p className="mt-3 text-[0.85rem] leading-relaxed text-smoke">
          {t("accountTypeHelp")}
        </p>
      </div>
    </div>
  );
}
