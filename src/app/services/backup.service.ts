import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BackupService {

  exportar(): void {

    const backup = {
      materiais:
        JSON.parse(localStorage.getItem('materiais') || '[]'),

      viaturas:
        JSON.parse(localStorage.getItem('viaturas') || '[]'),

      missoes:
        JSON.parse(localStorage.getItem('missoes') || '[]'),

      manutencoes:
        JSON.parse(localStorage.getItem('manutencoes') || '[]')
    };

    const blob = new Blob(
      [JSON.stringify(backup, null, 2)],
      { type: 'application/json' }
    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');

    a.href = url;
    a.download = 'backup-sgg.json';
    a.click();

    URL.revokeObjectURL(url);
  }

  importar(file: File): Promise<void> {

    return new Promise((resolve) => {

      const reader = new FileReader();

      reader.onload = () => {

        const data =
          JSON.parse(reader.result as string);

        localStorage.setItem(
          'materiais',
          JSON.stringify(data.materiais)
        );

        localStorage.setItem(
          'viaturas',
          JSON.stringify(data.viaturas)
        );

        localStorage.setItem(
          'missoes',
          JSON.stringify(data.missoes)
        );

        localStorage.setItem(
          'manutencoes',
          JSON.stringify(data.manutencoes)
        );

        resolve();
      };

      reader.readAsText(file);
    });
  }
}