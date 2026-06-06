import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit {
  protected readonly title = signal('SGG');
  protected readonly theme = signal<'light' | 'dark'>('light');

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('theme');
      this.setTheme(storedTheme === 'dark' ? 'dark' : 'light');
    }
  }

  protected toggleTheme(): void {
    this.setTheme(this.theme() === 'dark' ? 'light' : 'dark');
  }

  private setTheme(theme: 'light' | 'dark'): void {
    this.theme.set(theme);

    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark-theme', theme === 'dark');
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme);
    }
  }
}
