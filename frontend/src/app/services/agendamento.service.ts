import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AgendamentoService {
  private apiUrl = 'http://localhost:3003/api/agendamentos';

  constructor(private http: HttpClient) {}

  getAgendamentos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  cadastrar(agendamento: any): Observable<any> {
    return this.http.post(this.apiUrl, agendamento);
  }
}
