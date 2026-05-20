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
            <p class="text-gray-400 text-sm mb-2">Seu pedido foi enviado ao restaurante.</p>
            <p class="text-gray-500 text-sm mb-8">Obrigado por escolher o Foodly.</p>
            <div class="bg-gray-50 rounded-xl p-4 mb-8 text-left">
              <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Pagamento via</p>
              <p class="font-bold text-gray-800">
                {{ metodoPagamento() === 'PIX' ? 'PIX' : metodoPagamento() === 'DEBITO' ? 'Cartão de Débito' : 'Cartão de Crédito' }}
              </p>
            </div>
            <button (click)="voltarHome()"
              class="w-full bg-red-500 text-white font-bold py-3.5 rounded-xl hover:bg-red-600 transition">
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
                <button (click)="selecionarMetodo('PIX')"
                  class="w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all"
                  [class.border-red-400]="metodoPagamento() === 'PIX'"
                  [class.bg-red-50]="metodoPagamento() === 'PIX'"
                  [class.border-gray-200]="metodoPagamento() !== 'PIX'"
                  [class.bg-white]="metodoPagamento() !== 'PIX'">
                  <div class="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <lucide-icon name="zap" class="w-5 h-5 text-green-600"></lucide-icon>
                  </div>
                  <div class="text-left flex-1">
                    <p class="font-bold text-gray-900 text-sm">PIX</p>
                    <p class="text-xs text-gray-400">Pagamento instantâneo</p>
                  </div>
                  @if (metodoPagamento() === 'PIX') {
                    <lucide-icon name="check-circle" class="w-5 h-5 text-red-500"></lucide-icon>
                  }
                </button>

                <button (click)="selecionarMetodo('DEBITO')"
                  class="w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all"
                  [class.border-red-400]="metodoPagamento() === 'DEBITO'"
                  [class.bg-red-50]="metodoPagamento() === 'DEBITO'"
                  [class.border-gray-200]="metodoPagamento() !== 'DEBITO'"
                  [class.bg-white]="metodoPagamento() !== 'DEBITO'">
                  <div class="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                    <lucide-icon name="credit-card" class="w-5 h-5 text-blue-500"></lucide-icon>
                  </div>
                  <div class="text-left flex-1">
                    <p class="font-bold text-gray-900 text-sm">Cartão de Débito</p>
                    <p class="text-xs text-gray-400">Débito direto na conta</p>
                  </div>
                  @if (metodoPagamento() === 'DEBITO') {
                    <lucide-icon name="check-circle" class="w-5 h-5 text-red-500"></lucide-icon>
                  }
                </button>

                <button (click)="selecionarMetodo('CREDITO')"
                  class="w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all"
                  [class.border-red-400]="metodoPagamento() === 'CREDITO'"
                  [class.bg-red-50]="metodoPagamento() === 'CREDITO'"
                  [class.border-gray-200]="metodoPagamento() !== 'CREDITO'"
                  [class.bg-white]="metodoPagamento() !== 'CREDITO'">
                  <div class="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                    <lucide-icon name="wallet" class="w-5 h-5 text-purple-500"></lucide-icon>
                  </div>
                  <div class="text-left flex-1">
                    <p class="font-bold text-gray-900 text-sm">Cartão de Crédito</p>
                    <p class="text-xs text-gray-400">Parcelamento disponível</p>
                  </div>
                  @if (metodoPagamento() === 'CREDITO') {
                    <lucide-icon name="check-circle" class="w-5 h-5 text-red-500"></lucide-icon>
                  }
                </button>
              </div>

              @if (metodoPagamento() === 'DEBITO' || metodoPagamento() === 'CREDITO') {
                <div class="mt-4 space-y-3">
                  <div>
                    <label class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Número do Cartão</label>
                    <input type="text" placeholder="0000 0000 0000 0000" maxlength="19"
                      class="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-red-400/20 focus:border-red-400 transition text-gray-700 text-sm">
                  </div>
                  <div class="grid grid-cols-2 gap-3">
                    <div>
                      <label class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Validade</label>
                      <input type="text" placeholder="MM/AA" maxlength="5"
                        class="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-red-400/20 focus:border-red-400 transition text-gray-700 text-sm">
                    </div>
                    <div>
                      <label class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">CVV</label>
                      <input type="text" placeholder="123" maxlength="3"
                        class="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-red-400/20 focus:border-red-400 transition text-gray-700 text-sm">
                    </div>
                  </div>
                </div>
              }

              @if (metodoPagamento() === 'PIX') {
                <div class="mt-4 bg-gray-50 rounded-xl p-5 text-center border border-gray-200">
                  <p class="text-sm font-bold text-gray-600 mb-3">Chave PIX do restaurante</p>
                  <div class="w-20 h-20 bg-white rounded-xl mx-auto flex items-center justify-center border border-gray-200 mb-3">
                    <lucide-icon name="smartphone" class="w-8 h-8 text-gray-400"></lucide-icon>
                  </div>
                  <p class="text-xs text-gray-400">Escaneie ou copie a chave PIX ao confirmar</p>
                </div>
              }
            </div>

            @if (erro()) {
              <div class="bg-red-50 border border-red-100 text-red-500 text-sm rounded-xl px-4 py-3 text-center flex items-center justify-center gap-2">
                <lucide-icon name="alert-circle" class="w-4 h-4"></lucide-icon>
                {{ erro() }}
              </div>
            }

            <div class="space-y-2">
              <button (click)="confirmarPagamento()" [disabled]="!metodoPagamento() || enviando()"
                class="w-full bg-red-500 text-white font-bold py-4 rounded-xl hover:bg-red-600 transition disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-sm">
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

  total = computed(() =>
    this.service.carrinhoItens().reduce((acc, item: any) => acc + item.preco, 0)
  );

  selecionarMetodo(m: MetodoPagamento) { this.metodoPagamento.set(m); }

  confirmarPagamento() {
    if (!this.metodoPagamento()) return;
    const itens = this.service.carrinhoItens();
    if (itens.length === 0) return;
    const restauranteId = itens[0]?.restauranteId;

    if (!restauranteId) {
      this.erro.set('Não foi possível identificar o restaurante. Volte e tente novamente.');
      return;
    }

    const payload = {
      restauranteId,
      itens: itens.map((item: any) => ({ produtoId: item.id, quantidade: 1 }))
    };

    this.enviando.set(true);
    this.erro.set('');

    this.service.realizarPedido(payload).subscribe({
      next: () => {
        this.enviando.set(false);
        this.service.limparCarrinho();
        this.pedidoConfirmado.set(true);
      },
      error: (err) => {
        this.enviando.set(false);
        this.erro.set(err.error?.erro ?? 'Erro ao realizar pedido.');
      }
    });
  }

  voltar()     { this.router.navigate(['/restaurantes']); }
  voltarHome() { this.router.navigate(['/restaurantes']); }
}
