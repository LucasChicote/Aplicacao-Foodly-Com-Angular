import { Component, inject, OnInit, computed, signal } from '@angular/core';
import { ApiService } from '../service/api.service';
import { TodoItemComponent } from '../components/todo-item/todo-item';
import { HeaderComponent } from '../components/header/header';
import { CategoriasComponent } from '../components/categorias/categorias';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TodoItemComponent, HeaderComponent, CategoriasComponent, CommonModule, FormsModule],
  template: `
    <app-header />

    <div class="min-h-screen bg-gradient-to-br from-green-50/50 via-white to-teal-50/30">
      <main class="max-w-7xl mx-auto p-4 lg:p-8 grid grid-cols-1 lg:grid-cols-4 gap-8">

        <div class="lg:col-span-3">

          <div class="bg-gradient-to-r from-green-500 to-teal-500 rounded-3xl p-6 mb-6 text-white shadow-lg shadow-green-200/50">
            <p class="text-green-100 text-sm font-bold uppercase tracking-widest mb-1">Olá, {{ service.getNome().split(' ')[0] }} 👋</p>
            <h1 class="text-2xl font-black">O que vai pedir hoje?</h1>
            <p class="text-green-100 text-sm mt-1">Pratos frescos, entrega sustentável 🌱</p>
          </div>

          <div class="relative mb-4">
            <span class="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 text-xl">🔍</span>
            <input type="text" [(ngModel)]="termoBusca"
              placeholder="Buscar pratos, ingredientes..."
              class="w-full bg-white border border-green-100 rounded-2xl p-4 pl-14 outline-none focus:ring-2 focus:ring-green-400/20 focus:border-green-300 transition-all shadow-sm text-gray-700 placeholder:text-gray-300">
          </div>

          <app-categorias (categoriaChange)="onCategoriaChange($event)" />

          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-black text-gray-800">
              {{ categoriaSelecionada ? '🏷️ ' + categoriaSelecionada.nome : '🔥 Mais pedidos' }}
            </h2>
            <span class="text-sm text-gray-400 font-medium">{{ produtosFiltrados().length }} itens</span>
          </div>

          @if (produtosFiltrados().length === 0) {
            <div class="text-center py-20">
              <p class="text-5xl mb-4">🌿</p>
              <p class="font-black text-gray-400 text-lg">Nenhum prato encontrado</p>
              <p class="text-gray-300 text-sm">Tente outro filtro ou busca</p>
            </div>
          }

          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            @for (p of produtosFiltrados(); track p.id) {
              <app-todo-item [item]="p" (adicionar)="adicionar(p)" />
            }
          </div>
        </div>

        <div class="lg:col-span-1">
          <div class="bg-white rounded-[2.5rem] shadow-xl shadow-green-100/40 border border-green-50 p-6 sticky top-24">

            <div class="flex items-center justify-between mb-6">
              <h2 class="text-lg font-black text-gray-900 flex items-center gap-2">
                🛍️ Sacola
              </h2>
              @if (service.carrinhoItens().length > 0) {
                <span class="bg-green-500 text-white text-xs font-black w-6 h-6 rounded-full flex items-center justify-center">
                  {{ service.carrinhoItens().length }}
                </span>
              }
            </div>

            @if (service.carrinhoItens().length > 0) {

              <div class="space-y-3 max-h-[35vh] overflow-y-auto mb-6 pr-1">
                @for (item of carrinhoAgrupado(); track item.id) {
                  <div class="flex justify-between items-center bg-green-50/50 rounded-2xl p-3">
                    <div class="flex-1 min-w-0">
                      <span class="font-bold text-gray-800 text-sm block truncate">{{ item.nome }}</span>
                      <span class="text-[10px] font-bold text-green-500 uppercase tracking-widest">
                        {{ item.qtd }}x {{ item.preco | currency:'BRL' }}
                      </span>
                    </div>
                    <span class="font-black text-gray-800 text-sm ml-2">{{ item.qtd * item.preco | currency:'BRL' }}</span>
                  </div>
                }
              </div>

              <div class="border-t border-dashed border-green-100 pt-4">
                <div class="flex justify-between font-black text-lg text-gray-900 mb-5">
                  <span>Total</span>
                  <span class="text-green-600">{{ total() | currency:'BRL' }}</span>
                </div>

                <button (click)="irParaPagamento()"
                  class="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white font-black py-4 rounded-2xl hover:from-green-600 hover:to-teal-600 shadow-lg shadow-green-200 transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-wide active:scale-[0.98]">
                  Finalizar Pedido →
                </button>

                <button (click)="cancelarPedido()"
                  class="w-full text-gray-300 font-bold text-xs py-2 flex items-center justify-center gap-1 hover:text-red-400 transition mt-2">
                  🗑️ Limpar sacola
                </button>
              </div>

            } @else {
              <div class="text-center py-10">
                <p class="text-5xl mb-3 opacity-30">🛍️</p>
                <p class="text-gray-300 text-sm font-medium">Sacola vazia</p>
                <p class="text-gray-200 text-xs">Adicione itens do cardápio</p>
              </div>
            }
          </div>
        </div>

      </main>
    </div>
  `
})
export class HomeComponent implements OnInit {
  service = inject(ApiService);
  router = inject(Router);

  termoBusca = '';
  categoriaSelecionada: any = null;

  total = computed(() =>
    this.service.carrinhoItens().reduce((acc, item) => acc + item.preco, 0)
  );

  carrinhoAgrupado = computed(() => {
    const map = new Map<number, any>();
    for (const item of this.service.carrinhoItens()) {
      if (map.has(item.id)) {
        map.get(item.id).qtd++;
      } else {
        map.set(item.id, { ...item, qtd: 1 });
      }
    }
    return Array.from(map.values());
  });

  produtosFiltrados = computed(() => {
    const termo = this.termoBusca.toLowerCase();
    if (!termo) return this.service.produtos();
    return this.service.produtos().filter(p =>
      p.nome?.toLowerCase().includes(termo) ||
      p.descricao?.toLowerCase().includes(termo)
    );
  });

  ngOnInit() { this.service.listarProdutos(); }

  onCategoriaChange(categoria: any) {
    this.categoriaSelecionada = categoria;
    this.termoBusca = '';
    categoria
      ? this.service.listarProdutosPorCategoria(categoria.id)
      : this.service.listarProdutos();
  }

  adicionar(p: any) { this.service.adicionarAoCarrinho(p); }
  irParaPagamento() { this.router.navigate(['/pagamento']); }
  cancelarPedido() { this.service.limparCarrinho(); }
}