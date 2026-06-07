import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class BackupService {
  constructor(private storage: StorageService) {}

  exportarDados(): void {

    const backup = {
      materiais: this.storage.get<any[]>('materiais') || [],
      viaturas: this.storage.get<any[]>('viaturas') || [],
      missoes: this.storage.get<any[]>('missoes') || [],
      manutencoes: this.storage.get<any[]>('manutencoes') || [],
      movimentacoes: this.storage.get<any[]>('movimentacoes') || []
    };

    const fileName = `SGG_BACKUP_${new Date().toISOString().slice(0, 10)}.json`;
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');

    a.href = url;
    a.download = fileName;
    a.click();

    URL.revokeObjectURL(url);
  }

  importarDados(file: File): Promise<void> {

    return new Promise((resolve) => {

      const reader = new FileReader();

      reader.onload = () => {

        const data =
          JSON.parse(reader.result as string);

        this.storage.save('materiais', data.materiais || []);
        this.storage.save('viaturas', data.viaturas || []);
        this.storage.save('missoes', data.missoes || []);
        this.storage.save('manutencoes', data.manutencoes || []);
        this.storage.save('movimentacoes', data.movimentacoes || []);

        resolve();
      };

      reader.readAsText(file);
    });
  }

  startAutoBackup(intervalMs = 300000): void {
    if (!this.hasLocalStorage()) {
      return;
    }

    setInterval(() => {
      const backup = {
        materiais: this.storage.get<any[]>('materiais') || [],
        viaturas: this.storage.get<any[]>('viaturas') || [],
        missoes: this.storage.get<any[]>('missoes') || [],
        manutencoes: this.storage.get<any[]>('manutencoes') || [],
        movimentacoes: this.storage.get<any[]>('movimentacoes') || []
      };

      localStorage.setItem('sgg_auto_backup', JSON.stringify(backup));
    }, intervalMs);
  }

  private hasLocalStorage(): boolean {
    try {
      return typeof localStorage !== 'undefined' && localStorage !== null;
    } catch {
      return false;
    }
  }
}
