import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { CommonModule } from '@angular/common';

import { Viatura } from '../../models/viatura.model';

@Component({
  selector: 'app-viatura-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './viatura-form.component.html',
  styleUrls: ['./viatura-form.component.css']
})
export class ViaturaFormComponent implements OnInit, OnChanges {

  @Input()
  viatura?: Viatura;

  @Output()
  salvar = new EventEmitter<Viatura>();

  @Output()
  fechar = new EventEmitter<void>();

  form!: FormGroup;

  tipos = [
    'AMBULANCIA',
    'VAN',
    'ADMINISTRATIVO'
  ];

  statusOptions = [
    'ATIVA',
    'MANUTENCAO',
    'BAIXADA'
  ];

  constructor(
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.criarFormulario();

    if (this.viatura) {
      this.preencherFormulario();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['viatura'] && this.form) {
      this.preencherFormulario();
    }
  }

  private criarFormulario(): void {
    this.form = this.fb.group({
      prefixo: ['', Validators.required],
      placa: ['', Validators.required],
      modelo: ['', Validators.required],
      marca: ['', Validators.required],
      ano: [2026],
      chassi: [''],
      tipo: ['AMBULANCIA'],
      status: ['ATIVA'],
      tipoOleo: [''],
      capacidadeTanque: [0],
      odometroAtual: [0],
      proximaTrocaOleo: [0],
      proximaTrocaPneus: [0],
      observacao: ['']
    });
  }

  private preencherFormulario(): void {
    if (!this.viatura) {
      this.form.reset({
        prefixo: '',
        placa: '',
        modelo: '',
        marca: '',
        ano: 2026,
        chassi: '',
        tipo: 'AMBULANCIA',
        status: 'ATIVA',
        tipoOleo: '',
        capacidadeTanque: 0,
        odometroAtual: 0,
        proximaTrocaOleo: 0,
        proximaTrocaPneus: 0,
        observacao: ''
      });
      return;
    }

    this.form.patchValue({
      prefixo: this.viatura.prefixo,
      placa: this.viatura.placa,
      modelo: this.viatura.modelo,
      marca: this.viatura.marca,
      ano: this.viatura.ano,
      chassi: this.viatura.chassi,
      tipo: this.viatura.tipo,
      status: this.viatura.status,
      tipoOleo: this.viatura.tipoOleo,
      capacidadeTanque: this.viatura.capacidadeTanque,
      odometroAtual: this.viatura.odometroAtual,
      proximaTrocaOleo: this.viatura.proximaTrocaOleo,
      proximaTrocaPneus: this.viatura.proximaTrocaPneus,
      observacao: this.viatura.observacao ?? ''
    });
  }

  salvarViatura(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const viatura: Viatura = {
      id: this.viatura?.id ?? crypto.randomUUID(),
      ...this.form.value
    };

    this.salvar.emit(viatura);
  }

  cancelar(): void {
    this.fechar.emit();
  }
}
