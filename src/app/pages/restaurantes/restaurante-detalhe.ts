import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { HeaderComponent } from '../../components/header/header';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-restaurante-detalhe',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FormsModule],
  template: `
    <app-header />

    <div class="min-h-screen bg-gradient-to-br from-green-50/50 via-white to-teal-50/30">
      <main class="max-w-7xl mx-auto p-4 lg:p-8 grid grid-cols-1 lg:grid-cols-4 gap-8">

        <div class="lg:col-span-3">

          @if (restaurante()) {
            <div class="relative rounded-3xl overflow-hidden mb-6 shadow-lg">
              
              <div class="w-full h-52 bg-gradient-to-r from-teal-500 to-green-500 flex items-center justify-center relative overflow-hidden">
                @if (restaurante().imagemUrl) {
                  <img [src]="restaurante().imagemUrl" [alt]="restaurante().nome"
                    class="w-full h-full object-cover opacity-80">
                  
                  <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                } @else {
                  <span class="text-8xl opacity-40">🏪</span>
                  <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                }
                
                <div class="absolute bottom-5 left-6 text-white">
                  <p class="text-teal-200 text-xs font-bold uppercase tracking-widest mb-1">{{ restaurante().categoria }}</p>
                  <h1 class="text-2xl font-black">{{ restaurante().nome }}</h1>
                  @if (restaurante().descricao) {
                    <p class="text-white/80 text-sm mt-1">{{ restaurante().descricao }}</p>
                  }
                </div>
                
                <button (click)="voltar()"
                  class="absolute top-4 left-4 bg-white/20 backdrop-blur-sm text-white font-bold text-sm px-3 py-1.5 rounded-xl hover:bg-white/30 transition flex items-center gap-1">
                  ← Voltar
                </button>
              </div>
            </div>
          } @else {

            <div class="w-full h-52 bg-gray-100 rounded-3xl animate-pulse mb-6"></div>
          }

          <div class="flex gap-2 flex-wrap mb-5 overflow-x-auto pb-1">
            <button
              (click)="categoriaSelecionada.set(null)"
              class="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black border-2 transition-all whitespace-nowrap flex-none"
              [class.bg-teal-500]="categoriaSelecionada() === null"
              [class.text-white]="categoriaSelecionada() === null"
              [class.border-teal-500]="categoriaSelecionada() === null"
              [class.bg-white]="categoriaSelecionada() !== null"
              [class.text-gray-500]="categoriaSelecionada() !== null"
              [class.border-gray-100]="categoriaSelecionada() !== null">
              🍽️ Todos ({{ produtos().length }})
            </button>

            @for (cat of categoriasDoProdutos(); track cat) {
              <button
                (click)="categoriaSelecionada.set(cat)"
                class="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black border-2 transition-all whitespace-nowrap flex-none"
                [class.bg-green-500]="categoriaSelecionada() === cat"
                [class.text-white]="categoriaSelecionada() === cat"
                [class.border-green-500]="categoriaSelecionada() === cat"
                [class.bg-white]="categoriaSelecionada() !== cat"
                [class.text-gray-500]="categoriaSelecionada() !== cat"
                [class.border-gray-100]="categoriaSelecionada() !== cat">
                {{ cat }}
              </button>
            }
          </div>

          <div class="relative mb-5">
            <span class="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 text-lg">🔍</span>
            <input type="text" [(ngModel)]="termoBusca"
              placeholder="Buscar no cardápio deste restaurante..."
              class="w-full bg-white border border-green-100 rounded-2xl p-3.5 pl-13 outline-none focus:ring-2 focus:ring-green-400/20 focus:border-green-300 transition-all shadow-sm text-gray-700 placeholder:text-gray-300 text-sm">
          </div>

          <div class="flex items-center justify-between mb-4">
            <h2 class="font-black text-gray-800 text-lg">
              {{ categoriaSelecionada() ? '🏷️ ' + categoriaSelecionada() : '🔥 Cardápio completo' }}
            </h2>
            <span class="text-sm text-gray-400 font-medium">{{ produtosFiltrados().length }} itens</span>
          </div>

          @if (carregando()) {
            <div class="text-center py-16">
              <div class="w-10 h-10 border-4 border-green-200 border-t-green-500 rounded-full animate-spin mx-auto mb-4"></div>
              <p class="text-gray-300 text-sm font-medium">Carregando cardápio...</p>
            </div>
          } @else if (produtosFiltrados().length === 0) {
            <div class="text-center py-16">
              <p class="text-5xl mb-4">🌿</p>
              <p class="font-black text-gray-400 text-lg">Nenhum prato encontrado</p>
              <p class="text-gray-300 text-sm">Tente outro filtro ou busca</p>
            </div>
          } @else {
            
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              @for (p of produtosFiltrados(); track p.id) {
                <div class="bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group">

                  <div class="w-full h-44 bg-gradient-to-br from-green-50 to-teal-50 overflow-hidden flex items-center justify-center relative">
                    @if (p.imagemUrl) {
                      <img [src]="p.imagemUrl" [alt]="p.nome"
                        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                    } @else {
                      <span class="text-6xl opacity-40">🍽️</span>
                    }
                  </div>

                  <div class="p-5">
                    @if (p.categoria) {
                      <span class="text-[10px] font-black text-teal-500 uppercase tracking-widest">{{ p.categoria }}</span>
                    }
                    <h3 class="font-black text-gray-800 text-base mt-1 leading-tight">{{ p.nome }}</h3>
                    <p class="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                      {{ p.descricao || 'Ingredientes selecionados com cuidado e qualidade.' }}
                    </p>
                    <div class="flex items-center justify-between mt-4">
                      <span class="font-black text-xl text-green-600">{{ p.preco | currency:'BRL' }}</span>
                      <button (click)="adicionarAoCarrinho(p)"
                        class="bg-gradient-to-r from-green-500 to-teal-500 text-white w-10 h-10 rounded-2xl flex items-center justify-center hover:from-green-600 hover:to-teal-600 shadow-md shadow-green-200 active:scale-90 transition-all text-xl font-bold">
                        +
                      </button>
                    </div>
                  </div>
                </div>
              }
            </div>
          }
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
                <button (click)="service.limparCarrinho()"
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
export class RestauranteDetalheComponent implements OnInit {
  service = inject(ApiService);
  router  = inject(Router);
  route   = inject(ActivatedRoute);

  restaurante      = signal<any>(null);
  produtos         = signal<any[]>([]);
  categoriaSelecionada = signal<string | null>(null);
  termoBusca       = '';
  carregando       = signal(true);

  categoriasDoProdutos = computed(() => {
    const cats = this.produtos()
      .map(p => p.categoria)
      .filter((c): c is string => !!c);
    return [...new Set(cats)].sort();
  });

  produtosFiltrados = computed(() => {
    let lista = this.produtos();

    const cat = this.categoriaSelecionada();
    if (cat) {
      lista = lista.filter(p => p.categoria === cat);
    }

    const termo = this.termoBusca.toLowerCase().trim();
    if (termo) {
      lista = lista.filter(p =>
        p.nome?.toLowerCase().includes(termo) ||
        p.descricao?.toLowerCase().includes(termo)
      );
    }

    return lista;
  });

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

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.service.listarRestaurantes();
    const tentarEncontrarRestaurante = () => {
      const lista = this.service.restaurantes();
      const found = lista.find(r => r.id === id);
      if (found) {
        this.restaurante.set(found);
      } else if (lista.length === 0) {
        setTimeout(tentarEncontrarRestaurante, 200);
      }
    };
    tentarEncontrarRestaurante();

    this.service.listarProdutosPorRestauranteObs(id).subscribe({
      next: (res) => {
        this.produtos.set(res);
        this.carregando.set(false);
      },
      error: () => this.carregando.set(false)
    });
  }

  adicionarAoCarrinho(produto: any) {
    this.service.adicionarAoCarrinho({ ...produto, restauranteId: this.restaurante()?.id });
  }

  irParaPagamento() { this.router.navigate(['/pagamento']); }
  voltar()          { this.router.navigate(['/restaurantes']); }
}