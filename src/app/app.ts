import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './services/theme.service';
import { BackupService } from './services/backup.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  private readonly themeService = inject(ThemeService);
  private readonly backupService = inject(BackupService);

  protected readonly title = 'SGG';
  protected readonly theme = this.themeService.theme$;

  constructor() {
    this.backupService.startAutoBackup();
  }

  protected toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
