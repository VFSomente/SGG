import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_STORAGE_KEY = 'app-theme';
  private readonly theme = signal<Theme>('light');

  theme$ = this.theme.asReadonly();

  constructor() {
    this.initializeTheme();
  }

  private initializeTheme(): void {
    if (typeof window === 'undefined') return;

    // Try to get stored preference
    const storedTheme = localStorage.getItem(this.THEME_STORAGE_KEY) as Theme | null;
    
    if (storedTheme) {
      this.setTheme(storedTheme);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.setTheme(prefersDark ? 'dark' : 'light');
    }

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem(this.THEME_STORAGE_KEY)) {
        this.setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  setTheme(theme: Theme): void {
    this.theme.set(theme);

    if (typeof document !== 'undefined') {
      const html = document.documentElement;
      
      if (theme === 'dark') {
        html.classList.add('dark-theme');
      } else {
        html.classList.remove('dark-theme');
      }
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem(this.THEME_STORAGE_KEY, theme);
    }
  }

  toggleTheme(): void {
    this.setTheme(this.theme() === 'dark' ? 'light' : 'dark');
  }

  getTheme(): Theme {
    return this.theme();
  }

  isDarkMode(): boolean {
    return this.theme() === 'dark';
  }
}
