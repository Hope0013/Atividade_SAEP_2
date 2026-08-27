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
  agendamentos: any[] = [];
  clientes: any[] = [];
  recursos: any[] = [];

  formAgendamento = {
    cliente_id: '',
    recurso_id: '',
    data_agendamento: '',
    hora_agendamento: '',
  };

  alertaErro: string = '';

  constructor(
    private agendamentoService: AgendamentoService,
    private clienteService: ClienteService,
    private recursoService: RecursoService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.carregarAgendamentos();
    this.carregarClientes();
    this.carregarRecursos();
  }

  carregarAgendamentos(): void {
    this.agendamentoService.getAgendamentos().subscribe((data) => {
      this.agendamentos = data;
      this.cdr.detectChanges();
    });
  }

  carregarClientes(): void {
    this.clienteService.getCliente().subscribe((data) => {
      this.clientes = data;
      this.cdr.detectChanges();
    });
  }

  carregarRecursos(): void {
    this.recursoService.getRecursos().subscribe((data) => {
      this.recursos = data;
      this.cdr.detectChanges();
    });
  }

  formatarData(data: string): string {
    if (!data) return '';
    const dataPura = data.substring(0, 10); 
    const [ano, mes, dia] = dataPura.split('-');
    return `${dia}/${mes}/${ano}`;
  }

  formatarHora(hora: string): string {
    if (!hora) return '';
    return hora.substring(0, 5); // "14:00:00" -> "14:00"
  }
  agendar(): void {
    this.alertaErro = '';
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
        this.carregarAgendamentos();
      },
      error: (err) => {
        this.alertaErro = err.error?.error || 'Erro ao agendar.';
        this.cdr.detectChanges();
      },
    });
  }
}
