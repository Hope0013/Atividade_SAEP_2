import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class ClienteService {
  private apiUrl = 'http://localhost:3003/api/clientes';

  constructor(private http : HttpClient) {}

  getCliente(busca?: string): Observable<any[]> {
    const url = busca ? `${this.apiUrl}?busca=${busca}` : this.apiUrl;
    return this.http.get<any[]>(url);
  }

  cadastrar(cliente: any): Observable<any>{
    return this.http.post(this.apiUrl, cliente);
  }

  atualizar(id: number, cliente: any): Observable<any>{
    return this.http.put(`${this.apiUrl}/${id}`, cliente)
  }
}
