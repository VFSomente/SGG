import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BackupService } from '../../services/backup.service';

@Component({
  selector: 'app-backup',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './backup.component.html',
  styleUrls: ['./backup.component.css'],
})
export class BackupComponent {
  arquivoImportacao?: File;

  constructor(private backupService: BackupService) {}

  exportar(): void {
    this.backupService.exportarDados();
  }

  importar(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) {
      return;
    }

    this.backupService.importarDados(input.files[0]);
    input.value = '';
  }
}
