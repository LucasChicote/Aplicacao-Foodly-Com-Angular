import { Component, inject, computed, signal } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../components/header/header';
import { LucideAngularModule } from 'lucide-angular';

type MetodoPagamento = 'PIX' | 'DEBITO' | 'CREDITO' | null;

@Component({
  standalone: true,
  imports: [CommonModule, HeaderComponent, LucideAngularModule],
  template: `
    <app-header />
    <div class="min-h-screen bg-gray-50 flex items-start justify-center p-4 pt-8">
      <div class="w-full max-w-lg">

        @if (pedidoConfirmado()) {
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">
            <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <lucide-icon name="check-circle" class="w-10 h-10 text-green-600"></lucide-icon>
            </div>
            <h2 class="text-xl font-black text-gray-900 mb-2">Pedido Confirmado!</h2>
            <p class="text-gray-400 text-sm mb-6">Seu pedido foi enviado ao restaurante.</p>

            <div class="bg-gradient-to-r from-green-50 to-teal-50 border border-green-100 rounded-2xl p-5 mb-6 text-left">
              <div class="flex items-center gap-2 mb-3">
                <lucide-icon name="leaf" class="w-5 h-5 text-green-600"></lucide-icon>
                <h3 class="font-black text-green-800 text-sm">Seu impacto positivo</h3>
              </div>
              <p class="text-green-700 text-sm mb-3">
                Com este pedido, você contribuiu para evitar o desperdício de aproximadamente
                <strong>{{ co2Evitado().peso }} kg</strong> de alimentos, o que evita a emissão de
                <strong class="text-lg">{{ co2Evitado().co2 }} kg de CO₂</strong> na atmosfera.
              </p>
              <div class="grid grid-cols-3 gap-2 text-center text-xs">
                <div class="bg-white/70 rounded-xl p-2">
                  <p class="font-black text-green-700">{{ co2Evitado().km }} km</p>
                  <p class="text-green-500">em carro</p>
                </div>
                <div class="bg-white/70 rounded-xl p-2">
                  <p class="font-black text-green-700">{{ co2Evitado().arvores }}</p>
                  <p class="text-green-500">árvore(s)/ano</p>
                </div>
                <div class="bg-white/70 rounded-xl p-2">
                  <p class="font-black text-green-700">{{ co2Evitado().banhos }}</p>
                  <p class="text-green-500">banhos</p>
                </div>
              </div>
            </div>

            <button (click)="voltarHome()"
              class="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold py-3.5 rounded-xl hover:from-green-600 hover:to-teal-600 transition">
              Voltar ao início
            </button>
          </div>
        }

        @if (!pedidoConfirmado()) {
          <div class="space-y-4">
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 class="font-bold text-gray-900 text-base mb-4 flex items-center gap-2">
                <lucide-icon name="shopping-bag" class="w-5 h-5 text-gray-500"></lucide-icon>
                Resumo do pedido
              </h2>
              <div class="space-y-2 max-h-48 overflow-y-auto">
                @for (item of service.carrinhoItens(); track $index) {
                  <div class="flex justify-between text-sm py-1">
                    <span class="text-gray-600">{{ item.nome }}</span>
                    <span class="font-bold text-gray-800">{{ item.preco | currency:'BRL' }}</span>
                  </div>
                }
              </div>
              <div class="border-t border-gray-100 mt-4 pt-4 flex justify-between">
                <span class="font-bold text-gray-900">Total</span>
                <span class="font-black text-gray-900 text-lg">{{ total() | currency:'BRL' }}</span>
              </div>
            </div>

            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 class="font-bold text-gray-900 text-base mb-4 flex items-center gap-2">
                <lucide-icon name="credit-card" class="w-5 h-5 text-gray-500"></lucide-icon>
                Forma de Pagamento
              </h2>
              <div class="space-y-2">
                @for (metodo of metodos; track metodo.id) {
                  <button (click)="selecionarMetodo(metodo.id)"
                    class="w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all"
                    [class.border-green-400]="metodoPagamento() === metodo.id"
                    [class.bg-green-50]="metodoPagamento() === metodo.id"
                    [class.border-gray-200]="metodoPagamento() !== metodo.id"
                    [class.bg-white]="metodoPagamento() !== metodo.id">
                    <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-none" [class]="metodo.bg">
                      <lucide-icon [name]="metodo.icon" class="w-5 h-5" [class]="metodo.iconColor"></lucide-icon>
                    </div>
                    <div class="text-left flex-1">
                      <p class="font-bold text-gray-900 text-sm">{{ metodo.label }}</p>
                      <p class="text-xs text-gray-400">{{ metodo.sub }}</p>
                    </div>
                    @if (metodoPagamento() === metodo.id) {
                      <lucide-icon name="check-circle" class="w-5 h-5 text-green-500"></lucide-icon>
                    }
                  </button>
                }
              </div>
            </div>

            @if (erro()) {
              <div class="bg-red-50 border border-red-100 text-red-500 text-sm rounded-xl px-4 py-3 text-center flex items-center justify-center gap-2">
                <lucide-icon name="alert-circle" class="w-4 h-4"></lucide-icon>
                {{ erro() }}
              </div>
            }

            <div class="space-y-2">
              <button (click)="confirmarPagamento()" [disabled]="!metodoPagamento() || enviando()"
                class="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold py-4 rounded-xl hover:from-green-600 hover:to-teal-600 transition disabled:from-gray-200 disabled:to-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-sm">
                {{ enviando() ? 'Processando...' : !metodoPagamento() ? 'Selecione o pagamento' : 'Confirmar Pedido' }}
              </button>
              <button (click)="voltar()" class="w-full text-gray-400 font-semibold py-2 text-sm hover:text-gray-600 transition flex items-center justify-center gap-1">
                <lucide-icon name="chevron-left" class="w-4 h-4"></lucide-icon>
                Voltar ao cardápio
              </button>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class PagamentoComponent {
  service = inject(ApiService);
  router  = inject(Router);

  enviando         = signal(false);
  erro             = signal('');
  pedidoConfirmado = signal(false);
  metodoPagamento  = signal<MetodoPagamento>(null);

  metodos = [
    { id: 'PIX' as MetodoPagamento,    label: 'PIX',              sub: 'Pagamento instantâneo', icon: 'zap',         bg: 'bg-green-100',  iconColor: 'text-green-600' },
    { id: 'DEBITO' as MetodoPagamento,  label: 'Cartão de Débito', sub: 'Débito direto na conta', icon: 'credit-card', bg: 'bg-blue-50',    iconColor: 'text-blue-500' },
    { id: 'CREDITO' as MetodoPagamento, label: 'Cartão de Crédito',sub: 'Parcelamento disponível', icon: 'wallet',      bg: 'bg-purple-50',  iconColor: 'text-purple-500' },
  ];

  total = computed(() =>
    this.service.carrinhoItens().reduce((acc, item: any) => acc + item.preco, 0)
  );

  co2Evitado = computed(() => {
    const qtd = this.service.carrinhoItens().length;
    const peso = +(qtd * 0.35).toFixed(2);
    const co2  = +(peso * 2.5).toFixed(2);
    return {
      peso, co2,
      km:      Math.round(co2 / 0.21),
      arvores: Math.max(1, Math.round(co2 / 21)),
      banhos:  Math.round(co2 / 0.08),
    };
  });

  selecionarMetodo(m: MetodoPagamento) { this.metodoPagamento.set(m); }

  confirmarPagamento() {
    if (!this.metodoPagamento()) return;
    const itens = this.service.carrinhoItens();
    if (!itens.length) return;
    const restauranteId = itens[0]?.restauranteId;
    if (!restauranteId) { this.erro.set('Não foi possível identificar o restaurante.'); return; }

    this.enviando.set(true);
    this.erro.set('');
    this.service.realizarPedido({
      restauranteId,
      itens: itens.map((i: any) => ({ produtoId: i.id, quantidade: 1 }))
    }).subscribe({
      next: () => { this.enviando.set(false); this.service.limparCarrinho(); this.pedidoConfirmado.set(true); },
      error: err => { this.enviando.set(false); this.erro.set(err.error?.erro ?? 'Erro ao realizar pedido.'); }
    });
  }

  voltar()     { this.router.navigate(['/restaurantes']); }
  voltarHome() { this.router.navigate(['/restaurantes']); }
}
