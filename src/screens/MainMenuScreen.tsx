import { useRef, useState, useEffect } from "react";
import { useGame } from "../state/GameContext";
import { useScreenTransition } from "../hooks/useScreenTransition";
import { useT } from "../hooks/useT";
import { Button } from "../components/Button";
import { LANG_META, LANGS } from "../i18n/translations";
import type { Lang } from "../i18n/translations";

import enFlag from "../assets/flags/en.svg";
import esFlag from "../assets/flags/es.svg";
import ptFlag from "../assets/flags/pt.svg";
import deFlag from "../assets/flags/de.svg";
import frFlag from "../assets/flags/fr.svg";
import itFlag from "../assets/flags/it.svg";
import jaFlag from "../assets/flags/ja.svg";
import koFlag from "../assets/flags/ko.svg";
import ruFlag from "../assets/flags/ru.svg";

const FLAG_URLS: Record<Lang, string> = {
  en: enFlag,
  es: esFlag,
  pt: ptFlag,
  de: deFlag,
  fr: frFlag,
  it: itFlag,
  ja: jaFlag,
  ko: koFlag,
  ru: ruFlag,
};

export function MainMenuScreen() {
  const { state, dispatch } = useGame();
  const ref = useRef<HTMLDivElement>(null);
  useScreenTransition(ref);
  const t = useT();
  const [dropOpen, setDropOpen] = useState(false);

  useEffect(() => {
    if (!dropOpen) return;
    const close = () => setDropOpen(false);
    window.addEventListener("pointerdown", close);
    return () => window.removeEventListener("pointerdown", close);
  }, [dropOpen]);

  function selectLang(lang: Lang) {
    dispatch({ type: "SET_LANGUAGE", language: lang });
    setDropOpen(false);
  }

  return (
    <div ref={ref} style={screen}>
      {/* ── Top-right language dropdown ── */}
      <div style={topBar}>
        <div
          style={{ position: "relative" }}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <button
            style={triggerBtn}
            onClick={() => setDropOpen((o) => !o)}
            aria-label="Select language"
          >
            <img
              src={FLAG_URLS[state.language]}
              alt={LANG_META[state.language].nativeName}
              style={flagImg}
            />
            <span style={nativeName}>
              {LANG_META[state.language].nativeName}
            </span>
            <span style={{ fontSize: 10, color: "#6666aa", marginLeft: 2 }}>
              {dropOpen ? "▲" : "▼"}
            </span>
          </button>

          {dropOpen && (
            <div style={dropdown}>
              {LANGS.map((lang) => (
                <button
                  key={lang}
                  style={dropItem(lang === state.language)}
                  onClick={() => selectLang(lang)}
                >
                  <img
                    src={FLAG_URLS[lang]}
                    alt={LANG_META[lang].nativeName}
                    style={flagImg}
                  />
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: lang === state.language ? 800 : 500,
                      color: lang === state.language ? "#d0d0ff" : "#9090bb",
                    }}
                  >
                    {LANG_META[lang].nativeName}
                  </span>
                  {lang === state.language && <span style={checkmark}>✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Banner + title ── */}
      <div style={hero}>
        {/* <div style={bannerWrap}>
          <img src="/main-menu-banner.webp" alt="Guess Spectrum" style={bannerImg} />
          <div style={bannerOverlay} />
        </div> */}
        <img
          src="/main-menu-banner.webp"
          alt="Guess Spectrum"
          style={bannerImg}
        />

        <div style={titleWrap}>
          <p style={tagline}>{t.tagline}</p>
        </div>
      </div>

      {/* ── Buttons ── */}
      <div style={buttonGroup}>
        <Button fullWidth onClick={() => dispatch({ type: "GO_LOBBY" })}>
          {t.play}
        </Button>
        <Button
          fullWidth
          variant="secondary"
          onClick={() => dispatch({ type: "GO_INFO" })}
        >
          {t.howToPlay}
        </Button>
      </div>

      <div style={footer}>{t.footerMeta}</div>
    </div>
  );
}

const screen: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "14px 28px 40px",
  height: "100%",
  overflow: "hidden",
};

const topBar: React.CSSProperties = {
  width: "100%",
  display: "flex",
  justifyContent: "flex-end",
};

const triggerBtn: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: "6px 10px 6px 6px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.06)",
  cursor: "pointer",
  color: "#c0c0e8",
  fontFamily: "inherit",
};

const flagImg: React.CSSProperties = {
  width: 28,
  height: 21,
  borderRadius: 3,
  objectFit: "cover",
  display: "block",
  flexShrink: 0,
};

const nativeName: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  color: "#c0c0e8",
  whiteSpace: "nowrap",
};

const dropdown: React.CSSProperties = {
  position: "absolute",
  top: "calc(100% + 6px)",
  right: 0,
  background: "#14142e",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 14,
  padding: "6px",
  display: "flex",
  flexDirection: "column",
  gap: 2,
  zIndex: 200,
  boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
  minWidth: 180,
};

function dropItem(active: boolean): React.CSSProperties {
  return {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "8px 10px",
    borderRadius: 9,
    border: "none",
    background: active ? "rgba(80,80,255,0.2)" : "transparent",
    cursor: "pointer",
    fontFamily: "inherit",
    textAlign: "left",
    width: "100%",
    transition: "background 0.12s",
  };
}

const checkmark: React.CSSProperties = {
  marginLeft: "auto",
  fontSize: 13,
  color: "#7070ff",
  fontWeight: 900,
};

const hero: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 16,
  flex: 1,
  justifyContent: "center",
  width: "100%",
};

const bannerWrap: React.CSSProperties = {
  width: "100%",
  borderRadius: 20,
  overflow: "hidden",
  position: "relative",
  boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
};

const bannerImg: React.CSSProperties = {
  width: "100%",
  aspectRatio: "615 / 528",
  display: "block",
  objectFit: "cover",
};

const bannerOverlay: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  background:
    "linear-gradient(to bottom, transparent 40%, rgba(13,13,26,0.85) 100%)",
  pointerEvents: "none",
};

const titleWrap: React.CSSProperties = { textAlign: "center" };

const titleText: React.CSSProperties = {
  fontSize: 52,
  fontWeight: 900,
  letterSpacing: "-0.03em",
  margin: "0 0 8px",
  lineHeight: 1,
  textShadow: "0 0 60px rgba(80,100,255,0.5)",
};

const tagline: React.CSSProperties = {
  fontSize: 17,
  color: "#9090cc",
  margin: 0,
  letterSpacing: "0.02em",
};

const buttonGroup: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 12,
  width: "100%",
  maxWidth: 340,
};

const footer: React.CSSProperties = {
  marginTop: 20,
  fontSize: 12,
  color: "#3d3d60",
  letterSpacing: "0.04em",
  textAlign: "center",
};
