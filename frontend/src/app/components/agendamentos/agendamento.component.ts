// agendamento.component.ts
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgendamentoService } from '../../services/agendamento.service';
import { ClienteService } from '../../services/cliente.service';
import { RecursoService } from '../../services/recurso.service';
import { NavComponent } from '../nav/nav.component';

@Component({
  selector: 'app-agendamentos',
  standalone: true,
  imports: [CommonModule, FormsModule, NavComponent],
  templateUrl: './agendamento.component.html',
  styleUrl: './agendamento.component.css',
})
export class AgendamentosComponent implements OnInit {
  // Listas que vão guardar as informações vindas do banco de dados
  agendamentos: any[] = [];
  clientes: any[] = [];
  recursos: any[] = [];

  // Objeto para armazenar as opções que o usuário escolher no formulário
  formAgendamento = {
    cliente_id: '',
    recurso_id: '',
    data_agendamento: '',
    hora_agendamento: '',
  };

  // Variável para exibir mensagens de erro na tela
  alertaErro: string = '';

  // Serviços de API e o detector de alterações do Angular
  constructor(
    private agendamentoService: AgendamentoService,
    private clienteService: ClienteService,
    private recursoService: RecursoService,
    private cdr: ChangeDetectorRef,
  ) {}

  // Executado assim que o componente é exibido no navegador
  ngOnInit(): void {
    this.carregarAgendamentos();
    this.carregarClientes();
    this.carregarRecursos();
  }

  // Busca todos os agendamentos
  carregarAgendamentos(): void {
    this.agendamentoService.getAgendamentos().subscribe((data) => {
      this.agendamentos = data;
      this.cdr.detectChanges();
    });
  }

  // Busca clientes
  carregarClientes(): void {
    this.clienteService.getCliente().subscribe((data) => {
      this.clientes = data;
      this.cdr.detectChanges();
    });
  }

  // Busca os recursos
  carregarRecursos(): void {
    this.recursoService.getRecursos().subscribe((data) => {
      this.recursos = data;
      this.cdr.detectChanges();
    });
  }

  // Funcão para formatar a data
  formatarData(data: string): string {
    if (!data) return '';
    const dataPura = data.substring(0, 10);
    const [ano, mes, dia] = dataPura.split('-');
    return `${dia}/${mes}/${ano}`;
  }

  // Função para formatar a hora
  formatarHora(hora: string): string {
    if (!hora) return '';
    return hora.substring(0, 5); // "14:00:00" -> "14:00"
  }

  // Função ativa apos o envio do formulario
  agendar(): void {
    this.alertaErro = '';
    // Impede que o usuario deixe campos vazios
    if (
      !this.formAgendamento.cliente_id ||
      !this.formAgendamento.recurso_id ||
      !this.formAgendamento.data_agendamento ||
      !this.formAgendamento.hora_agendamento
    ) {
      alert('Preencha todos os campos do agendamento.');
      return;
    }

    this.agendamentoService.cadastrar(this.formAgendamento).subscribe({
      next: (res) => {
        alert(res.message);
        this.formAgendamento = {
          cliente_id: '',
          recurso_id: '',
          data_agendamento: '',
          hora_agendamento: '',
        };
        // Atualiza a tela
        this.carregarAgendamentos();
      },

      // Mensagem de erro caso o agendamento de erro
      error: (err) => {
        this.alertaErro = err.error?.error || 'Erro ao agendar.';
        this.cdr.detectChanges();
      },
    });
  }
}
