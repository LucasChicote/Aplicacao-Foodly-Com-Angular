import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private readonly URL = 'http://localhost:8080';

  produtos      = signal<any[]>([]);
  categorias    = signal<any[]>([]);
  restaurantes  = signal<any[]>([]);
  carrinhoItens = signal<any[]>([]);

  login(dados: { email: string; senha: string }): Observable<any> {
    return this.http.post(`${this.URL}/auth/login`, dados);
  }

  cadastrar(dados: {
    nome: string; email: string; senha: string;
    cep: string; role: 'ROLE_CUSTOMER' | 'ROLE_RESTAURANT_OWNER' | 'ROLE_ADMIN';
  }): Observable<any> {
    return this.http.post(`${this.URL}/auth/register`, dados);
  }

  buscarCep(cep: string): Observable<any> {
    return this.http.get(`${this.URL}/usuarios/cep/${cep}`);
  }

  listarCategorias() {
    this.http.get<any[]>(`${this.URL}/categorias`)
      .subscribe(res => this.categorias.set(res));
  }

  criarCategoria(dados: { nome: string }): Observable<any> {
    return this.http.post(`${this.URL}/categorias`, dados);
  }

  deletarCategoria(id: number): Observable<any> {
    return this.http.delete(`${this.URL}/categorias/${id}`);
  }

  listarUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.URL}/usuarios`);
  }

  deletarUsuario(id: number): Observable<any> {
    return this.http.delete(`${this.URL}/usuarios/${id}`);
  }

  listarRestaurantes() {
    this.http.get<any[]>(`${this.URL}/restaurantes`)
      .subscribe(res => this.restaurantes.set(res));
  }

  meusRestaurantes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.URL}/restaurantes/meus`);
  }

  criarRestaurante(dados: { nome: string; descricao: string; categoria: string; imagemUrl?: string }): Observable<any> {
    return this.http.post(`${this.URL}/restaurantes`, dados);
  }

  listarProdutos() {
    this.http.get<any[]>(`${this.URL}/produtos`)
      .subscribe(res => this.produtos.set(res));
  }

  listarProdutosPorCategoria(categoriaId: number) {
    this.http.get<any[]>(`${this.URL}/produtos/categoria/${categoriaId}`)
      .subscribe(res => this.produtos.set(res));
  }

  listarProdutosPorRestaurante(restauranteId: number) {
    this.http.get<any[]>(`${this.URL}/produtos/restaurante/${restauranteId}`)
      .subscribe(res => this.produtos.set(res));
  }

  listarProdutosPorRestauranteObs(restauranteId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.URL}/produtos/restaurante/${restauranteId}`);
  }

  criarProduto(dados: {
    nome: string; descricao: string; preco: number;
    imagemUrl?: string; categoriaId: number; restauranteId: number;
  }): Observable<any> {
    return this.http.post(`${this.URL}/produtos`, dados);
  }

  deletarProduto(id: number): Observable<any> {
    return this.http.delete(`${this.URL}/produtos/${id}`);
  }

  realizarPedido(dados: {
    restauranteId: number;
    itens: { produtoId: number; quantidade: number }[];
  }): Observable<any> {
    return this.http.post(`${this.URL}/pedidos`, dados);
  }

  meusPedidos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.URL}/pedidos/meus`);
  }

  pedidosDoRestaurante(restauranteId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.URL}/pedidos/restaurante/${restauranteId}`);
  }

  atualizarStatusPedido(pedidoId: number, novoStatus: string): Observable<any> {
    return this.http.patch(`${this.URL}/pedidos/${pedidoId}/status?novoStatus=${novoStatus}`, {});
  }

  adicionarAoCarrinho(produto: any) {
    this.carrinhoItens.update(itens => [...itens, produto]);
  }

  limparCarrinho() {
    this.carrinhoItens.set([]);
  }

  salvarSessao(token: string, nome: string, email: string, role: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('nome', nome);
    localStorage.setItem('email', email);
    localStorage.setItem('role', role);
  }

  logout() {
    ['token','nome','email','role'].forEach(k => localStorage.removeItem(k));
  }

  getNome():     string  { return localStorage.getItem('nome')  ?? 'Usuário'; }
  getEmail():    string  { return localStorage.getItem('email') ?? ''; }
  getRole():     string  { return localStorage.getItem('role')  ?? ''; }
  isAdmin():     boolean { return this.getRole() === 'ROLE_ADMIN'; }
  isOwner():     boolean { return this.getRole() === 'ROLE_RESTAURANT_OWNER'; }
  isCustomer():  boolean { return this.getRole() === 'ROLE_CUSTOMER'; }
}