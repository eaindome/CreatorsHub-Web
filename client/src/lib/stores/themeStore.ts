import { browser } from '$app/environment';
import { writable } from 'svelte/store';

// Check for user preference or system preference
const userTheme = browser ? localStorage.getItem('theme') : null;
const systemPrefersDark = browser ? window.matchMedia('(prefers-color-scheme: dark)').matches : false;

// Initialize theme based on preferences
const initialValue = userTheme || (systemPrefersDark ? 'dark' : 'light');

export const theme = writable<'light' | 'dark'>(initialValue as 'light' | 'dark');

// Update theme function
export function toggleTheme() {
  theme.update(currentTheme => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    if (browser) {
      localStorage.setItem('theme', newTheme);
      updateDocumentClass(newTheme);
    }
    return newTheme;
  });
}

// Apply theme class to document
export function initTheme() {
  if (browser) {
    theme.subscribe(value => {
      updateDocumentClass(value);
    });
  }
}

function updateDocumentClass(theme: string) {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}