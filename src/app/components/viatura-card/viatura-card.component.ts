import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Viatura } from '../../models/viatura.model';

@Component({
  selector: 'app-viatura-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './viatura-card.component.html',
  styleUrls: ['./viatura-card.component.css']
})
export class ViaturaCardComponent {
  @Input()
  viatura!: Viatura;

  statusClass() {
    switch (this.viatura.status) {
      case 'ATIVA':
        return 'status-ativa';
      case 'MANUTENCAO':
        return 'status-manutencao';
      case 'BAIXADA':
        return 'status-baixada';
      default:
        return '';
    }
  }
}
