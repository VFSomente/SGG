import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  OnChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { Manutencao } from '../../models/manutencao.model';
import { AlmoxarifadoService } from '../../services/almoxarifado.service';

@Component({
  selector: 'app-manutencao-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './manutencao-form.component.html',
  styleUrls: ['./manutencao-form.component.css']
})
export class ManutencaoFormComponent implements OnInit, OnChanges {
  @Input()
  viaturaId!: string;

  @Input()
  manutencao?: Manutencao;

  @Output()
  salvar = new EventEmitter<Manutencao>();

  @Output()
  fechar = new EventEmitter<void>();

  form!: FormGroup;

  pecasDisponiveis: any[] = [];

  constructor(
    private fb: FormBuilder,
    private almoxarifadoService: AlmoxarifadoService
  ) {}

  ngOnInit(): void {
    this.criarFormulario();
    this.carregarPecas();

    if (this.manutencao) {
      this.preencherFormulario();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['manutencao'] && this.form) {
      this.preencherFormulario();
    }
  }

  private criarFormulario(): void {
    this.form = this.fb.group({
      data: [this.hoje(), Validators.required],
      servico: ['', Validators.required],
      profissional: ['', Validators.required],
      observacao: [''],
      pecasUtilizadas: [[]],
      novasPecas: ['']
    });
  }

  private hoje(): string {
    return new Date().toISOString().split('T')[0];
  }

  private carregarPecas(): void {
    this.pecasDisponiveis = this.almoxarifadoService.getAll();
  }

  private preencherFormulario(): void {
    if (!this.manutencao) {
      this.form.reset({
        data: this.hoje(),
        servico: '',
        profissional: '',
        observacao: '',
        pecasUtilizadas: [],
        novasPecas: ''
      });
      return;
    }

    this.form.patchValue({
      data: this.manutencao.data,
      servico: this.manutencao.servico,
      profissional: this.manutencao.profissional,
      observacao: this.manutencao.observacao,
      pecasUtilizadas: this.manutencao.pecasUtilizadas || []
    });
  }

  adicionarPeca(peca: any): void {
    const pecasArray = this.form.get('pecasUtilizadas')?.value || [];
    if (!pecasArray.includes(peca.id)) {
      pecasArray.push(peca.id);
      this.form.patchValue({ pecasUtilizadas: pecasArray });
      // Subtrai imediatamente do almoxarifado quando a peça existe
      try {
        this.almoxarifadoService.saida(peca.id, 1);
        // atualizar lista local para refletir nova quantidade
        this.carregarPecas();
      } catch (e) {
        // silencioso — serviço já lida com inexistência
      }
    }
  }

  removerPeca(pecaId: string): void {
    const pecasArray = this.form.get('pecasUtilizadas')?.value || [];
    const idx = pecasArray.indexOf(pecaId);
    if (idx !== -1) {
      pecasArray.splice(idx, 1);
      this.form.patchValue({ pecasUtilizadas: pecasArray });
    }
  }

  salvarManutencao(): void {
    if (this.form.invalid) {
      return;
    }

    const pecasArray = this.form.get('pecasUtilizadas')?.value || [];

    const manutencao: Manutencao = {
      id: this.manutencao?.id ?? crypto.randomUUID(),
      viaturaId: this.viaturaId,
      data: this.form.get('data')?.value,
      servico: this.form.get('servico')?.value,
      profissional: this.form.get('profissional')?.value,
      observacao: this.form.get('observacao')?.value,
      pecasUtilizadas: pecasArray
    };

    // Observação: estoque já foi atualizado ao adicionar cada peça.

    this.salvar.emit(manutencao);
  }

  cancelar(): void {
    this.fechar.emit();
  }

  getNomePeca(pecaId: string): string {
    return this.pecasDisponiveis.find(p => p.id === pecaId)?.nome || pecaId;
  }

  adicionarPecaPorNome(nome: string): void {
    if (!nome || !nome.trim()) return;
    const encontrado = this.pecasDisponiveis.find(p => p.nome.toLowerCase() === nome.trim().toLowerCase());
    if (encontrado) {
      this.adicionarPeca(encontrado);
      this.form.patchValue({ novasPecas: '' });
    }
  }
}
