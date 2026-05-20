import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private readonly URL = 'http://localhost:8080';

  produtos = signal<any[]>([]);
  categorias = signal<any[]>([]);
  restaurantes = signal<any[]>([]);
  kits = signal<any[]>([]);
  carrinhoItens = signal<any[]>([]);

  login(dados: { email: string; senha: string }): Observable<any> {
    return this.http.post(`${this.URL}/auth/login`, dados);
  }

  cadastrar(dados: any): Observable<any> {
    return this.http.post(`${this.URL}/auth/register`, dados);
  }

  listarRestaurantes() {
    this.http.get<any[]>(`${this.URL}/restaurantes`).subscribe(res => this.restaurantes.set(res));
  }

  listarKits() {
    this.http.get<any[]>(`${this.URL}/produtos/kits`).subscribe(res => this.kits.set(res));
  }

  buscarGlobal(termo: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.URL}/search?termo=${termo}`);
  }

  adicionarAoCarrinho(produto: any) {
    this.carrinhoItens.update(itens => [...itens, produto]);
  }

  limparCarrinho() {
    this.carrinhoItens.set([]);
  }

  getNome(): string { return localStorage.getItem('nome') ?? 'Usuário'; }
  getRole(): string { return localStorage.getItem('role') ?? ''; }
  isAdmin(): boolean { return this.getRole() === 'ROLE_ADMIN'; }
  isOwner(): boolean { return this.getRole() === 'ROLE_RESTAURANT_OWNER'; }
  isCustomer(): boolean { return this.getRole() === 'ROLE_CUSTOMER'; }
}