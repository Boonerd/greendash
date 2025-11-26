// src/app/apply-dark-mode.ts
"use client";

import { useEffect } from "react";

export default function ApplyDarkMode() {
  useEffect(() => {
    const applyTheme = () => {
      if (
        localStorage.theme === "dark" ||
        (!localStorage.theme && window.matchMedia("(prefers-color-scheme: dark)").matches)
      ) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };

    applyTheme();
    window.addEventListener("storage", applyTheme);
    return () => window.removeEventListener("storage", applyTheme);
  }, []);

  return null;
}