// clientes.component.ts
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../../services/cliente.service';
import { NavComponent } from '../nav/nav.component';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule, NavComponent],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css',
})
export class ClientesComponent implements OnInit {
  clientes: any[] = [];
  termoBusca: string = '';
  clienteForm: any = { id: null, nome: '', documento: '', telefone: '', email: '' };
  editando: boolean = false;
  erroCadastro: string = '';

  constructor(
    private clienteService: ClienteService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.carregarClientes();
  }

  carregarClientes(): void {
    this.clienteService.getCliente(this.termoBusca).subscribe((data) => {
      this.clientes = data;
      this.cdr.detectChanges();
    });
  }

  salvar(): void {
    this.erroCadastro = '';
    if (!this.clienteForm.nome || !this.clienteForm.documento) {
      alert('Preencha os campos obrigatórios (Nome e Documento)!');
      return;
    }

    const acao = this.editando
      ? this.clienteService.atualizar(this.clienteForm.id, this.clienteForm)
      : this.clienteService.cadastrar(this.clienteForm);

    acao.subscribe({
      next: () => {
        this.limparForm();
        this.carregarClientes();
      },
      error: (err) => {
        this.erroCadastro =
          err.error?.error ||
          'Erro ao salvar cliente. Verifique se o documento já não está cadastrado.';
        this.cdr.detectChanges();
      },
    });
  }

  editar(c: any): void {
    this.erroCadastro = '';
    this.clienteForm = { ...c };
    this.editando = true;
  }

  limparForm(): void {
    this.clienteForm = { id: null, nome: '', documento: '', telefone: '', email: '' };
    this.editando = false;
    this.erroCadastro = '';
  }
}
