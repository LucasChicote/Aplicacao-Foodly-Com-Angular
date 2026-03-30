import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private readonly URL = 'http://localhost:8080';
  
  produtos = signal<any[]>([]);
  carrinhoItens = signal<any[]>([]);

  login(dados: any) {
    return this.http.post(`${this.URL}/auth/login`, dados);
  }

  buscarCep(cep: string): Observable<any> {
    return this.http.get(`${this.URL}/usuarios/cep/${cep}`);
  }

  listarProdutos() {
    this.http.get<any[]>(`${this.URL}/produtos`).subscribe(res => this.produtos.set(res));
  }

  salvar(dados: any): Observable<any> {
    return this.http.post(`${this.URL}/usuarios`, dados);
  }

adicionarAoCarrinho(produto: any) {
    this.carrinhoItens.update(itens => [...itens, produto]);
  }

  limparCarrinho() {
    this.carrinhoItens.set([]);
  }
}