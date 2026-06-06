import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { CommonModule } from '@angular/common';

import { Material } from '../../models/material.model';

@Component({
  selector: 'app-material-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './almoxarifado-form.component.html',
  styleUrls: ['./almoxarifado-form.component.css']
})
export class AlmoxarifadoFormComponent implements OnInit {

  @Input()
  material?: Material;

  @Output()
  salvar = new EventEmitter<Material>();

  @Output()
  fechar = new EventEmitter<void>();

  form!: FormGroup;

  categorias: string[] = [
    'Limpeza',
    'Lubrificantes',
    'Ferramentas',
    'Peças',
    'EPIs',
    'Elétrica',
    'Hidráulica',
    'Pneus',
    'Combustíveis',
    'Outros'
  ];

  previewImagem: string = '';

  constructor(
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {

    this.criarFormulario();

    if (this.material) {
      this.preencherFormulario();
    }
  }

  private criarFormulario(): void {

    this.form = this.fb.group({

      nome: [
        '',
        [
          Validators.required,
          Validators.minLength(3)
        ]
      ],

      categoria: [
        '',
        Validators.required
      ],

      quantidade: [
        0,
        [
          Validators.required,
          Validators.min(0)
        ]
      ],

      estoqueMinimo: [
        0,
        [
          Validators.required,
          Validators.min(0)
        ]
      ],

      validade: [
        ''
      ],

      localizacao: [
        ''
      ],

      imagem: [
        ''
      ]
    });
  }

  private preencherFormulario(): void {

    this.form.patchValue({

      nome: this.material?.nome,

      categoria: this.material?.categoria,

      quantidade: this.material?.quantidade,

      estoqueMinimo: this.material?.estoqueMinimo,

      validade: this.material?.validade,

      localizacao: this.material?.localizacao,

      imagem: this.material?.imagem
    });

    this.previewImagem =
      this.material?.imagem ?? '';
  }

  selecionarImagem(event: Event): void {

    const input =
      event.target as HTMLInputElement;

    if (!input.files?.length) {
      return;
    }

    const file = input.files[0];

    const reader = new FileReader();

    reader.onload = () => {

      const imagem =
        reader.result as string;

      this.previewImagem = imagem;

      this.form.patchValue({
        imagem
      });
    };

    reader.readAsDataURL(file);
  }

  salvarMaterial(): void {

    if (this.form.invalid) {

      this.form.markAllAsTouched();

      return;
    }

    const material: Material = {

      id:
        this.material?.id ??
        crypto.randomUUID(),

      ...this.form.value
    };

    this.salvar.emit(material);
  }

  cancelar(): void {
    this.fechar.emit();
  }

  get nome() {
    return this.form.get('nome');
  }

  get categoria() {
    return this.form.get('categoria');
  }

  get quantidade() {
    return this.form.get('quantidade');
  }

  get estoqueMinimo() {
    return this.form.get('estoqueMinimo');
  }
}