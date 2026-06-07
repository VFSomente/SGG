import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Missao } from '../../models/missao.model';

@Component({
  selector: 'app-missao-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './missao-form.component.html',
  styleUrls: ['./missao-form.component.css']
})
export class MissaoFormComponent implements OnInit {
  @Input()
  viaturaId!: string;

  @Input()
  missao?: Missao;

  @Output()
  salvar = new EventEmitter<Missao>();

  @Output()
  fechar = new EventEmitter<void>();

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.criarFormulario();
    if (this.missao) {
      this.preencherFormulario();
    }
  }

  private criarFormulario(): void {
    this.form = this.fb.group({
      data: [this.hoje(), Validators.required],
      horaSaida: ['', Validators.required],
      horaChegada: ['', Validators.required],
      kmSaida: [0, [Validators.required, Validators.min(0)]],
      kmChegada: [0, [Validators.required, Validators.min(0)]],
      missao: ['', Validators.required],
      observacao: ['']
    });
  }

  private hoje(): string {
    return new Date().toISOString().split('T')[0];
  }

  private preencherFormulario(): void {
    this.form.patchValue({
      data: this.missao?.data ?? this.hoje(),
      horaSaida: this.missao?.horaSaida ?? '',
      horaChegada: this.missao?.horaChegada ?? '',
      kmSaida: this.missao?.kmSaida ?? 0,
      kmChegada: this.missao?.kmChegada ?? 0,
      missao: this.missao?.missao ?? '',
      observacao: this.missao?.observacao ?? ''
    });
  }

  salvarMissao(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const nova: Missao = {
      id: this.missao?.id ?? crypto.randomUUID(),
      viaturaId: this.viaturaId,
      data: this.form.get('data')?.value,
      horaSaida: this.form.get('horaSaida')?.value,
      horaChegada: this.form.get('horaChegada')?.value,
      kmSaida: this.form.get('kmSaida')?.value,
      kmChegada: this.form.get('kmChegada')?.value,
      missao: this.form.get('missao')?.value,
      observacao: this.form.get('observacao')?.value
    };

    this.salvar.emit(nova);
  }

  cancelar(): void {
    this.fechar.emit();
  }

  get descricao() {
    return this.form.get('missao');
  }

  get horaSaida() {
    return this.form.get('horaSaida');
  }

  get horaChegada() {
    return this.form.get('horaChegada');
  }

  get kmSaida() {
    return this.form.get('kmSaida');
  }

  get kmChegada() {
    return this.form.get('kmChegada');
  }
}
