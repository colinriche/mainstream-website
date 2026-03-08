/** Shared theme config and localStorage keys for main site + sub-pages (e.g. /theoperator) */

export const THEME_STORAGE_KEY = 'mainstream-theme';
export const DARK_STORAGE_KEY = 'mainstream-dark';

/** Guest default when user has not visited home (no stored preference). */
export const DEFAULT_GUEST_THEME = 'black';
export const DEFAULT_GUEST_DARK_MODE = true;

const validThemes = ['green', 'red', 'blue', 'black'];

export function getStoredTheme() {
  if (typeof window === 'undefined') return DEFAULT_GUEST_THEME;
  const t = window.localStorage.getItem(THEME_STORAGE_KEY);
  return validThemes.includes(t) ? t : DEFAULT_GUEST_THEME;
}

export function getStoredDarkMode() {
  if (typeof window === 'undefined') return DEFAULT_GUEST_DARK_MODE;
  const d = window.localStorage.getItem(DARK_STORAGE_KEY);
  if (d === null) return DEFAULT_GUEST_DARK_MODE;
  return d === 'true';
}

export function setStoredTheme(theme) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(THEME_STORAGE_KEY, theme);
}

export function setStoredDarkMode(dark) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(DARK_STORAGE_KEY, String(dark));
}

export const themes = {
  green: {
    light: 'from-green-50 to-emerald-100',
    dark: 'from-gray-900 to-green-900',
    accent: 'bg-green-600',
    accentHover: 'hover:bg-green-700',
    text: 'text-green-600',
    border: 'border-green-600'
  },
  red: {
    light: 'from-red-50 to-rose-100',
    dark: 'from-gray-900 to-red-900',
    accent: 'bg-red-600',
    accentHover: 'hover:bg-red-700',
    text: 'text-red-600',
    border: 'border-red-600'
  },
  blue: {
    light: 'from-blue-50 to-indigo-100',
    dark: 'from-gray-900 to-blue-900',
    accent: 'bg-blue-600',
    accentHover: 'hover:bg-blue-700',
    text: 'text-blue-600',
    border: 'border-blue-600'
  },
  black: {
    light: 'from-gray-100 to-gray-200',
    dark: 'from-black to-gray-900',
    accent: 'bg-black',
    accentHover: 'hover:bg-gray-900',
    text: 'text-black',
    border: 'border-black'
  }
};
