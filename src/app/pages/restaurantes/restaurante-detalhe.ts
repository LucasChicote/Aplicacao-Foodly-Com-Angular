import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { HeaderComponent } from '../../components/header/header';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-restaurante-detalhe',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FormsModule, LucideAngularModule],
  template: `
    <app-header />

    <div class="min-h-screen bg-gray-50">
      <main class="max-w-7xl mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">

        <div class="lg:col-span-3">

          @if (restaurante()) {
            <div class="relative rounded-2xl overflow-hidden mb-5 shadow-sm">
              <div class="w-full h-48 bg-gray-200 flex items-center justify-center relative overflow-hidden">
                @if (restaurante().imagemUrl) {
                  <img [src]="restaurante().imagemUrl" [alt]="restaurante().nome"
                    class="w-full h-full object-cover">
                  <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
                } @else {
                  <lucide-icon name="store" class="w-16 h-16 text-gray-400"></lucide-icon>
                  <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                }

                <div class="absolute bottom-4 left-5 text-white">
                  @if (restaurante().categoria) {
                    <p class="text-white/70 text-xs font-semibold uppercase tracking-widest mb-0.5">{{ restaurante().categoria }}</p>
                  }
                  <h1 class="text-xl font-black">{{ restaurante().nome }}</h1>
                  @if (restaurante().descricao) {
                    <p class="text-white/75 text-xs mt-0.5">{{ restaurante().descricao }}</p>
                  }
                </div>

                <button (click)="voltar()"
                  class="absolute top-3 left-3 bg-black/30 backdrop-blur-sm text-white font-semibold text-xs px-3 py-1.5 rounded-lg hover:bg-black/50 transition flex items-center gap-1">
                  <lucide-icon name="chevron-left" class="w-3.5 h-3.5"></lucide-icon>
                  Voltar
                </button>
              </div>
            </div>
          } @else {
            <div class="w-full h-48 bg-gray-200 rounded-2xl animate-pulse mb-5"></div>
          }

          <div class="flex gap-2 flex-wrap mb-4 overflow-x-auto pb-1">
            <button
              (click)="categoriaSelecionada.set(null)"
              class="flex-none px-4 py-2 rounded-xl text-xs font-bold border-2 transition whitespace-nowrap"
              [class.bg-green-500]="categoriaSelecionada() === null"
              [class.text-white]="categoriaSelecionada() === null"
              [class.border-green-500]="categoriaSelecionada() === null"
              [class.bg-white]="categoriaSelecionada() !== null"
              [class.text-gray-500]="categoriaSelecionada() !== null"
              [class.border-gray-200]="categoriaSelecionada() !== null">
              Tudo ({{ produtos().length }})
            </button>

            @for (cat of categoriasDoProdutos(); track cat) {
              <button
                (click)="categoriaSelecionada.set(cat)"
                class="flex-none px-4 py-2 rounded-xl text-xs font-bold border-2 transition whitespace-nowrap"
                [class.bg-green-500]="categoriaSelecionada() === cat"
                [class.text-white]="categoriaSelecionada() === cat"
                [class.border-green-500]="categoriaSelecionada() === cat"
                [class.bg-white]="categoriaSelecionada() !== cat"
                [class.text-gray-500]="categoriaSelecionada() !== cat"
                [class.border-gray-200]="categoriaSelecionada() !== cat">
                {{ cat }}
              </button>
            }
          </div>

          <div class="relative mb-5">
            <lucide-icon name="search" class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"></lucide-icon>
            <input type="text" [(ngModel)]="termoBusca"
              placeholder="Buscar no cardápio..."
              class="w-full bg-white border border-gray-200 rounded-xl p-3 pl-11 outline-none focus:ring-2 focus:ring-green-400/20 focus:border-green-400 transition shadow-sm text-gray-700 placeholder:text-gray-400 text-sm">
          </div>

          <div class="flex items-center justify-between mb-4">
            <h2 class="font-bold text-gray-900 text-base">
              {{ categoriaSelecionada() ?? 'Cardápio completo' }}
            </h2>
            <span class="text-sm text-gray-400">{{ produtosFiltrados().length }} itens</span>
          </div>

          @if (carregando()) {
            <div class="text-center py-16">
              <div class="w-8 h-8 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin mx-auto mb-3"></div>
              <p class="text-gray-400 text-sm">Carregando cardápio...</p>
            </div>
          } @else if (produtosFiltrados().length === 0) {
            <div class="text-center py-16">
              <lucide-icon name="search-x" class="w-10 h-10 text-gray-200 mx-auto mb-3"></lucide-icon>
              <p class="font-bold text-gray-400">Nenhum prato encontrado</p>
              <p class="text-gray-300 text-sm mt-1">Tente outro filtro ou busca</p>
            </div>
          } @else {
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              @for (p of produtosFiltrados(); track p.id) {
                <div class="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">

                  <div class="w-full h-40 bg-gray-100 overflow-hidden flex items-center justify-center">
                    @if (p.imagemUrl) {
                      <img [src]="p.imagemUrl" [alt]="p.nome"
                        class="w-full h-full object-cover">
                    } @else {
                      <lucide-icon name="utensils" class="w-10 h-10 text-gray-300"></lucide-icon>
                    }
                  </div>

                  <div class="p-4">
                    @if (p.categoria) {
                      <span class="text-[10px] font-bold text-green-600 uppercase tracking-widest">{{ p.categoria }}</span>
                    }
                    <h3 class="font-bold text-gray-900 text-sm mt-0.5 leading-tight">{{ p.nome }}</h3>
                    <p class="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                      {{ p.descricao || 'Ingredientes selecionados com cuidado.' }}
                    </p>
                    <div class="flex items-center justify-between mt-3">
                      <span class="font-black text-lg text-gray-900">{{ p.preco | currency:'BRL' }}</span>
                      <button (click)="adicionarAoCarrinho(p)"
                        class="bg-green-500 text-white w-9 h-9 rounded-xl flex items-center justify-center hover:bg-green-600 active:scale-90 transition-all">
                        <lucide-icon name="plus" class="w-4 h-4"></lucide-icon>
                      </button>
                    </div>
                  </div>
                </div>
              }
            </div>
          }
        </div>

        <div class="lg:col-span-1">
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sticky top-20">

            <div class="flex items-center justify-between mb-5">
              <h2 class="text-base font-bold text-gray-900 flex items-center gap-2">
                <lucide-icon name="shopping-bag" class="w-5 h-5 text-green-600"></lucide-icon>
                Sacola
              </h2>
              @if (service.carrinhoItens().length > 0) {
                <span class="bg-green-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {{ service.carrinhoItens().length }}
                </span>
              }
            </div>

            @if (service.carrinhoItens().length > 0) {
              <div class="space-y-2 max-h-[35vh] overflow-y-auto mb-5 pr-1">
                @for (item of carrinhoAgrupado(); track item.id) {
                  <div class="flex justify-between items-center bg-gray-50 rounded-xl p-3">
                    <div class="flex-1 min-w-0">
                      <span class="font-semibold text-gray-800 text-sm block truncate">{{ item.nome }}</span>
                      <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        {{ item.qtd }}x {{ item.preco | currency:'BRL' }}
                      </span>
                    </div>
                    <span class="font-bold text-gray-800 text-sm ml-2">{{ item.qtd * item.preco | currency:'BRL' }}</span>
                  </div>
                }
              </div>

              <div class="border-t border-gray-100 pt-4">
                <div class="flex justify-between font-bold text-base text-gray-900 mb-4">
                  <span>Total</span>
                  <span>{{ total() | currency:'BRL' }}</span>
                </div>

                <button (click)="irParaPagamento()"
                  class="w-full bg-green-500 text-white font-bold py-3.5 rounded-xl hover:bg-green-600 transition text-sm">
                  Finalizar Pedido
                </button>

                <button (click)="service.limparCarrinho()"
                  class="w-full text-gray-400 font-semibold text-xs py-2 flex items-center justify-center gap-1 hover:text-red-400 transition mt-2">
                  <lucide-icon name="trash-2" class="w-3.5 h-3.5"></lucide-icon>
                  Limpar sacola
                </button>
              </div>

            } @else {
              <div class="text-center py-10">
                <lucide-icon name="shopping-bag" class="w-10 h-10 text-gray-200 mx-auto mb-3"></lucide-icon>
                <p class="text-gray-400 text-sm font-medium">Sacola vazia</p>
                <p class="text-gray-300 text-xs mt-0.5">Adicione itens do cardápio</p>
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

  restaurante          = signal<any>(null);
  produtos             = signal<any[]>([]);
  categoriaSelecionada = signal<string | null>(null);
  termoBusca           = '';
  carregando           = signal(true);

  categoriasDoProdutos = computed(() => {
    const cats = this.produtos()
      .map(p => p.categoria)
      .filter((c): c is string => !!c);
    return [...new Set(cats)].sort();
  });

  produtosFiltrados = computed(() => {
    let lista = this.produtos();
    const cat = this.categoriaSelecionada();
    if (cat) lista = lista.filter(p => p.categoria === cat);
    const termo = this.termoBusca.toLowerCase().trim();
    if (termo) lista = lista.filter(p =>
      p.nome?.toLowerCase().includes(termo) ||
      p.descricao?.toLowerCase().includes(termo)
    );
    return lista;
  });

  total = computed(() =>
    this.service.carrinhoItens().reduce((acc, item) => acc + item.preco, 0)
  );

  carrinhoAgrupado = computed(() => {
    const map = new Map<number, any>();
    for (const item of this.service.carrinhoItens()) {
      if (map.has(item.id)) map.get(item.id).qtd++;
      else map.set(item.id, { ...item, qtd: 1 });
    }
    return Array.from(map.values());
  });

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.service.listarRestaurantes();
    const tentarEncontrar = () => {
      const lista = this.service.restaurantes();
      const found = lista.find(r => r.id === id);
      if (found) this.restaurante.set(found);
      else if (lista.length === 0) setTimeout(tentarEncontrar, 200);
    };
    tentarEncontrar();

    this.service.listarProdutosPorRestauranteObs(id).subscribe({
      next: (res) => { this.produtos.set(res); this.carregando.set(false); },
      error: () => this.carregando.set(false)
    });
  }

  adicionarAoCarrinho(produto: any) {
    this.service.adicionarAoCarrinho({ ...produto, restauranteId: this.restaurante()?.id });
  }

  irParaPagamento() { this.router.navigate(['/pagamento']); }
  voltar()          { this.router.navigate(['/restaurantes']); }
}
