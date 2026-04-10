import { Component, inject, computed, signal } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../components/header/header';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

type MetodoPagamento = 'PIX' | 'DEBITO' | 'CREDITO' | null;

@Component({
  standalone: true,
  imports: [CommonModule, HeaderComponent, ReactiveFormsModule],
  template: `
    <app-header />
    <div class="min-h-screen bg-gradient-to-br from-green-50/50 via-white to-teal-50/30 flex items-start justify-center p-4 pt-8">
      <div class="w-full max-w-lg">

        @if (pedidoConfirmado()) {
          <div class="bg-white rounded-[2.5rem] shadow-xl border border-green-100 p-10 text-center">
            <div class="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-5xl mx-auto mb-6 animate-bounce">✅</div>
            <h2 class="text-2xl font-black text-gray-800 mb-2">Pedido Confirmado!</h2>
            <p class="text-gray-400 mb-2">Seu pedido foi enviado ao restaurante.</p>
            <p class="text-green-600 font-bold text-sm mb-8">🌱 Obrigado por escolher um delivery sustentável!</p>
            <div class="bg-green-50 rounded-2xl p-4 mb-8 text-left">
              <p class="text-xs font-bold text-green-700 uppercase tracking-widest mb-2">Pagamento via</p>
              <p class="font-black text-gray-800">{{ metodoPagamento() === 'PIX' ? '💚 PIX' : metodoPagamento() === 'DEBITO' ? '💳 Cartão de Débito' : '💳 Cartão de Crédito' }}</p>
            </div>
            <button (click)="voltarHome()"
              class="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white font-black py-4 rounded-2xl hover:from-green-600 hover:to-teal-600 transition shadow-lg shadow-green-200">
              Voltar ao início 🏠
            </button>
          </div>
        }

        @if (!pedidoConfirmado()) {
          <div class="space-y-4">

            <div class="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6">
              <h2 class="font-black text-gray-800 text-lg mb-4 flex items-center gap-2">🛍️ Resumo do pedido</h2>
              <div class="space-y-2 max-h-48 overflow-y-auto">
                @for (item of service.carrinhoItens(); track $index) {
                  <div class="flex justify-between text-sm py-1">
                    <span class="text-gray-600">{{ item.nome }}</span>
                    <span class="font-bold text-gray-800">{{ item.preco | currency:'BRL' }}</span>
                  </div>
                }
              </div>
              <div class="border-t border-dashed border-green-100 mt-4 pt-4 flex justify-between">
                <span class="font-black text-gray-800 text-lg">Total</span>
                <span class="font-black text-green-600 text-xl">{{ total() | currency:'BRL' }}</span>
              </div>
            </div>

            <div class="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6">
              <h2 class="font-black text-gray-800 text-lg mb-4 flex items-center gap-2">💳 Forma de Pagamento</h2>

              <div class="space-y-3">

                <button (click)="selecionarMetodo('PIX')"
                  class="w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all"
                  [class.border-green-400]="metodoPagamento() === 'PIX'"
                  [class.bg-green-50]="metodoPagamento() === 'PIX'"
                  [class.border-gray-100]="metodoPagamento() !== 'PIX'"
                  [class.bg-white]="metodoPagamento() !== 'PIX'">
                  <div class="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-2xl">💚</div>
                  <div class="text-left">
                    <p class="font-black text-gray-800">PIX</p>
                    <p class="text-xs text-gray-400">Pagamento instantâneo • Sem taxas</p>
                  </div>
                  @if (metodoPagamento() === 'PIX') {
                    <span class="ml-auto text-green-500 text-xl">✓</span>
                  }
                </button>

                <button (click)="selecionarMetodo('DEBITO')"
                  class="w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all"
                  [class.border-green-400]="metodoPagamento() === 'DEBITO'"
                  [class.bg-green-50]="metodoPagamento() === 'DEBITO'"
                  [class.border-gray-100]="metodoPagamento() !== 'DEBITO'"
                  [class.bg-white]="metodoPagamento() !== 'DEBITO'">
                  <div class="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-2xl">💳</div>
                  <div class="text-left">
                    <p class="font-black text-gray-800">Cartão de Débito</p>
                    <p class="text-xs text-gray-400">Débito direto na conta</p>
                  </div>
                  @if (metodoPagamento() === 'DEBITO') {
                    <span class="ml-auto text-green-500 text-xl">✓</span>
                  }
                </button>

                <button (click)="selecionarMetodo('CREDITO')"
                  class="w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all"
                  [class.border-green-400]="metodoPagamento() === 'CREDITO'"
                  [class.bg-green-50]="metodoPagamento() === 'CREDITO'"
                  [class.border-gray-100]="metodoPagamento() !== 'CREDITO'"
                  [class.bg-white]="metodoPagamento() !== 'CREDITO'">
                  <div class="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-2xl">💜</div>
                  <div class="text-left">
                    <p class="font-black text-gray-800">Cartão de Crédito</p>
                    <p class="text-xs text-gray-400">Parcelamento disponível</p>
                  </div>
                  @if (metodoPagamento() === 'CREDITO') {
                    <span class="ml-auto text-green-500 text-xl">✓</span>
                  }
                </button>
              </div>

              @if (metodoPagamento() === 'DEBITO' || metodoPagamento() === 'CREDITO') {
                <div class="mt-4 space-y-3 animate-pulse-once">
                  <div>
                    <label class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Número do Cartão</label>
                    <input type="text" placeholder="0000 0000 0000 0000" maxlength="19"
                      class="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-green-400/20 focus:border-green-300 transition text-gray-700">
                  </div>
                  <div class="grid grid-cols-2 gap-3">
                    <div>
                      <label class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Validade</label>
                      <input type="text" placeholder="MM/AA" maxlength="5"
                        class="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-green-400/20 focus:border-green-300 transition text-gray-700">
                    </div>
                    <div>
                      <label class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">CVV</label>
                      <input type="text" placeholder="123" maxlength="3"
                        class="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-green-400/20 focus:border-green-300 transition text-gray-700">
                    </div>
                  </div>
                </div>
              }

              @if (metodoPagamento() === 'PIX') {
                <div class="mt-4 bg-green-50 rounded-2xl p-5 text-center border border-green-100">
                  <p class="text-sm font-bold text-green-700 mb-3">Chave PIX do restaurante</p>
                  <div class="w-24 h-24 bg-white rounded-2xl mx-auto flex items-center justify-center border border-green-200 text-5xl mb-3">
                    📱
                  </div>
                  <p class="text-xs text-gray-400">Escaneie ou copie a chave PIX ao confirmar</p>
                </div>
              }
            </div>

            @if (erro()) {
              <div class="bg-red-50 border border-red-100 text-red-500 text-sm rounded-2xl px-4 py-3 text-center">
                ⚠️ {{ erro() }}
              </div>
            }

            <div class="space-y-3">
              <button (click)="confirmarPagamento()" [disabled]="!metodoPagamento() || enviando()"
                class="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white font-black py-5 rounded-2xl hover:from-green-600 hover:to-teal-600 transition-all shadow-lg shadow-green-200 disabled:from-gray-200 disabled:to-gray-200 disabled:cursor-not-allowed uppercase tracking-wide">
                {{ enviando() ? 'Processando...' : !metodoPagamento() ? 'Selecione o pagamento' : 'Confirmar Pedido ✓' }}
              </button>
              <button (click)="voltar()" class="w-full text-gray-400 font-bold py-3 text-sm hover:text-gray-600 transition">
                ← Voltar ao cardápio
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
  router = inject(Router);

  enviando = signal(false);
  erro = signal('');
  pedidoConfirmado = signal(false);
  metodoPagamento = signal<MetodoPagamento>(null);

  total = computed(() =>
    this.service.carrinhoItens().reduce((acc, item: any) => acc + item.preco, 0)
  );

  selecionarMetodo(m: MetodoPagamento) { this.metodoPagamento.set(m); }

  confirmarPagamento() {
    if (!this.metodoPagamento()) return;
    const itens = this.service.carrinhoItens();
    if (itens.length === 0) return;

    const restauranteId = itens[0]?.restauranteId ?? 1;
    const payload = {
      restauranteId,
      itens: itens.map(item => ({ produtoId: item.id, quantidade: 1 }))
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

  voltar() { this.router.navigate(['/home']); }
  voltarHome() { this.router.navigate(['/home']); }
}