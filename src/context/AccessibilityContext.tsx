import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type ContrastMode = "normal" | "high";
export type FontScale = "md" | "lg" | "xl" | "xxl";

interface AccessibilityContextValue {
  contrast: ContrastMode;
  fontScale: FontScale;
  voiceEnabled: boolean;
  speechEnabled: boolean;
  setContrast: (v: ContrastMode) => void;
  setFontScale: (v: FontScale) => void;
  toggleVoice: () => void;
  toggleSpeech: () => void;
  speak: (text: string) => void;
}

const KEY = "flowlife.a11y.v1";

const AccessibilityContext = createContext<AccessibilityContextValue | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [contrast, setContrast] = useState<ContrastMode>("normal");
  const [fontScale, setFontScale] = useState<FontScale>("md");
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setContrast(parsed.contrast ?? "normal");
        setFontScale(parsed.fontScale ?? "md");
        setVoiceEnabled(!!parsed.voiceEnabled);
        setSpeechEnabled(!!parsed.speechEnabled);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify({ contrast, fontScale, voiceEnabled, speechEnabled }));
    document.documentElement.setAttribute("data-contrast", contrast);
    document.documentElement.setAttribute("data-font", fontScale);
  }, [contrast, fontScale, voiceEnabled, speechEnabled]);

  const speak = (text: string) => {
    if (!speechEnabled) return;
    try {
      const synth = window.speechSynthesis;
      if (!synth) return;
      synth.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "pt-BR";
      utterance.rate = 1;
      synth.speak(utterance);
    } catch {
      /* navegador sem suporte */
    }
  };

  const value = useMemo(
    () => ({
      contrast,
      fontScale,
      voiceEnabled,
      speechEnabled,
      setContrast,
      setFontScale,
      toggleVoice: () => setVoiceEnabled((v) => !v),
      toggleSpeech: () => setSpeechEnabled((v) => !v),
      speak,
    }),
    [contrast, fontScale, voiceEnabled, speechEnabled],
  );

  return <AccessibilityContext.Provider value={value}>{children}</AccessibilityContext.Provider>;
}

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) throw new Error("useAccessibility deve ser usado dentro de AccessibilityProvider");
  return ctx;
}
