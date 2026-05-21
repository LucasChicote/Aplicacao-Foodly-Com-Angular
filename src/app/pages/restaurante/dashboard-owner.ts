import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { HeaderComponent } from '../../components/header/header';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';

const STATUS_OPTIONS = ['CONFIRMADO','EM_PREPARO','SAIU_PARA_ENTREGA','ENTREGUE','CANCELADO'];
const STATUS_LABELS: Record<string, string> = {
  PENDENTE: 'Pendente', CONFIRMADO: 'Confirmado', EM_PREPARO: 'Em Preparo',
  SAIU_PARA_ENTREGA: 'Saiu p/ Entrega', ENTREGUE: 'Entregue', CANCELADO: 'Campelado'
};

const TIPOS_RESTAURANTE = [
  'Brasileira','Italiana','Japonesa','Americana','Mexicana','Árabe',
  'Chinesa','Francesa','Vegana','Frutos do Mar','Pizza','Hambúrguer',
  'Indiana','Espanhola','Peruana','Saudável','Lanches','Café','Outro'
];

const TIPOS_PRATO = [
  'Bebida','Sobremesa','Entrada','Prato Principal','Salgado',
  'Salada','Sopa','Lanche','Combo','Café da Manhã','Outro'
];

@Component({
  selector: 'app-dashboard-owner',
  standalone: true,
  imports: [CommonModule, HeaderComponent, ReactiveFormsModule, FormsModule, LucideAngularModule, CurrencyPipe],
  template: `
    <app-header />
    <div class="min-h-screen bg-gray-50 p-4 pt-6">
      <div class="max-w-6xl mx-auto space-y-6">

        <div class="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <img src="assets/logo.png" alt="Foodly" class="w-12 h-12 rounded-xl object-cover shadow">
          <div>
            <p class="text-gray-400 text-xs font-semibold uppercase tracking-widest">Painel do Restaurante</p>
            <h1 class="text-xl font-black text-gray-900">{{ service.getNome() }}</h1>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">

          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 class="font-bold text-gray-800 mb-5 flex items-center gap-2 text-base">
              <lucide-icon name="plus-circle" class="w-5 h-5 text-teal-500"></lucide-icon>
              Cadastrar Restaurante
            </h2>
            <form [formGroup]="restauranteForm" (ngSubmit)="criarRestaurante()" class="space-y-4">
              <div>
                <label class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Nome do Restaurante</label>
                <input formControlName="nome" placeholder="Ex: Cantina da Maria"
                  class="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-teal-400/20 focus:border-teal-400 transition text-gray-700">
              </div>
              <div>
                <label class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Descrição</label>
                <input formControlName="descricao" placeholder="Ex: Comida caseira com sabor de lar"
                  class="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-teal-400/20 focus:border-teal-400 transition text-gray-700">
              </div>

              <div>
                <label class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">
                  Tipos de Restaurante (Culinária)
                </label>
                <div class="flex flex-wrap gap-2 mb-2 max-h-28 overflow-y-auto pr-1">
                  @for (tipo of tiposRestaurante; track tipo) {
                    <button type="button" (click)="selecionarTipoRestaurante(tipo)"
                      class="px-3 py-1.5 rounded-lg text-xs font-semibold border transition"
                      [class.bg-teal-500]="categoriaRestauranteSelecionada() === tipo"
                      [class.text-white]="categoriaRestauranteSelecionada() === tipo"
                      [class.border-teal-500]="categoriaRestauranteSelecionada() === tipo"
                      [class.bg-gray-50]="categoriaRestauranteSelecionada() !== tipo"
                      [class.text-gray-600]="categoriaRestauranteSelecionada() !== tipo"
                      [class.border-gray-200]="categoriaRestauranteSelecionada() !== tipo">
                      {{ tipo }}
                    </button>
                  }
                </div>
                <div class="flex gap-2">
                  <input [(ngModel)]="digitarCategoriaRestaurante" [ngModelOptions]="{standalone: true}"
                    placeholder="Ou digite o tipo de culinária..."
                    (keydown.enter)="$event.preventDefault(); confirmarCategoriaRestaurante()"
                    class="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-teal-400/20 focus:border-teal-400 transition text-gray-700">
                  <button type="button" (click)="confirmarCategoriaRestaurante()"
                    class="px-4 py-2 bg-teal-500 text-white rounded-xl text-xs font-bold hover:bg-teal-600 transition whitespace-nowrap">
                    Confirmar
                  </button>
                </div>
                @if (restauranteForm.get('categoria')?.value) {
                  <p class="text-xs text-teal-600 font-semibold mt-1.5 flex items-center gap-1">
                    <lucide-icon name="check" class="w-3 h-3"></lucide-icon>
                    Selecionado: {{ restauranteForm.get('categoria')?.value }}
                  </p>
                }
              </div>

              <div>
                <label class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Imagem (opcional)</label>
                @if (previewRestaurante()) {
                  <div class="mb-2 relative">
                    <img [src]="previewRestaurante()" class="w-full h-32 object-cover rounded-xl border border-gray-200">
                    <button type="button" (click)="removerImagemRestaurante()"
                      class="absolute top-2 right-2 bg-white border border-gray-200 text-gray-500 rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition shadow-sm">
                      <lucide-icon name="x" class="w-3 h-3"></lucide-icon>
                    </button>
                  </div>
                }
                <label class="flex items-center gap-3 cursor-pointer bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-3 hover:border-gray-300 transition">
                  <lucide-icon name="image" class="w-4 h-4 text-gray-400 flex-none"></lucide-icon>
                  <span class="text-sm text-gray-500">{{ previewRestaurante() ? 'Trocar imagem' : 'Selecionar imagem' }}</span>
                  <input type="file" accept="image/*" class="hidden" (change)="onImagemRestauranteChange($event)">
                </label>
              </div>

              @if (erroRestaurante()) {
                <p class="text-red-500 text-xs">{{ erroRestaurante() }}</p>
              }
              @if (sucessoRestaurante()) {
                <p class="text-green-600 text-xs font-bold flex items-center gap-1">
                  <lucide-icon name="check-circle" class="w-4 h-4"></lucide-icon>
                  Restaurante cadastrado com sucesso!
                </p>
              }

              <button type="submit" [disabled]="restauranteForm.invalid || carregandoRestaurante()"
                class="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold py-3 rounded-xl hover:from-green-600 hover:to-teal-600 transition disabled:from-gray-200 disabled:to-gray-200 disabled:text-gray-400 flex items-center justify-center gap-2 text-sm">
                @if (carregandoRestaurante()) {
                  <lucide-icon name="loader" class="w-4 h-4 animate-spin"></lucide-icon> Salvando...
                } @else {
                  Cadastrar Restaurante
                }
              </button>
            </form>
          </div>

          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 class="font-bold text-gray-800 mb-5 flex items-center gap-2 text-base">
              <lucide-icon name="utensils" class="w-5 h-5 text-teal-500"></lucide-icon>
              Adicionar Produto
            </h2>
            <form [formGroup]="produtoForm" (ngSubmit)="criarProduto()" class="space-y-4">
              <div>
                <label class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Nome do Prato</label>
                <input formControlName="nome" placeholder="Ex: Frango Grelhado"
                  class="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-teal-400/20 focus:border-teal-400 transition text-gray-700">
              </div>
              <div>
                <label class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Descrição</label>
                <input formControlName="descricao" placeholder="Ingredientes e preparo..."
                  class="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-teal-400/20 focus:border-teal-400 transition text-gray-700">
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Preço</label>
                  <div class="relative">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">R$</span>
                    <input
                      [value]="precoFormatado()"
                      (input)="onPrecoInput($event)"
                      inputmode="numeric"
                      placeholder="0,00"
                      class="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 pl-9 text-sm outline-none focus:ring-2 focus:ring-teal-400/20 focus:border-teal-400 transition text-gray-700">
                  </div>
                </div>
                <div>
                  <label class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Restaurante</label>
                  <select formControlName="restauranteId"
                    class="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-teal-400/20 focus:border-teal-400 transition text-gray-700">
                    <option value="">Selecione...</option>
                    @for (r of meusRestaurantes(); track r.id) {
                      <option [value]="r.id">{{ r.nome }}</option>
                    }
                  </select>
                </div>
              </div>

              <div>
                <label class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Tipo de Prato</label>
                <div class="flex flex-wrap gap-2 mb-2 max-h-28 overflow-y-auto pr-1">
                  @for (tipo of tiposPrato; track tipo) {
                    <button type="button" (click)="selecionarTipoPrato(tipo)"
                      class="px-3 py-1.5 rounded-lg text-xs font-semibold border transition"
                      [class.bg-teal-500]="tipoPratoSelecionado() === tipo"
                      [class.text-white]="tipoPratoSelecionado() === tipo"
                      [class.border-teal-500]="tipoPratoSelecionado() === tipo"
                      [class.bg-gray-50]="tipoPratoSelecionado() !== tipo"
                      [class.text-gray-600]="tipoPratoSelecionado() !== tipo"
                      [class.border-gray-200]="tipoPratoSelecionado() !== tipo">
                      {{ tipo }}
                    </button>
                  }
                </div>
                <div class="flex gap-2">
                  <input [(ngModel)]="digitarCategoriaPrato" [ngModelOptions]="{standalone: true}"
                    placeholder="Ou digite o tipo do prato..."
                    (keydown.enter)="$event.preventDefault(); confirmarCategoriaPrato()"
                    class="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-teal-400/20 focus:border-teal-400 transition text-gray-700">
                  <button type="button" (click)="confirmarCategoriaPrato()"
                    class="px-4 py-2 bg-teal-500 text-white rounded-xl text-xs font-bold hover:bg-teal-600 transition whitespace-nowrap">
                    Confirmar
                  </button>
                </div>
                @if (produtoForm.get('categoriaNome')?.value) {
                  <p class="text-xs text-teal-600 font-semibold mt-1.5 flex items-center gap-1">
                    <lucide-icon name="check" class="w-3 h-3"></lucide-icon>
                    Selecionado: {{ produtoForm.get('categoriaNome')?.value }}
                  </p>
                }
              </div>

              <div>
                <label class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Imagem (opcional)</label>
                @if (previewProduto()) {
                  <div class="mb-2 relative">
                    <img [src]="previewProduto()" class="w-full h-32 object-cover rounded-xl border border-gray-200">
                    <button type="button" (click)="removerImagemProduto()"
                      class="absolute top-2 right-2 bg-white border border-gray-200 text-gray-500 rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition shadow-sm">
                      <lucide-icon name="x" class="w-3 h-3"></lucide-icon>
                    </button>
                  </div>
                }
                <label class="flex items-center gap-3 cursor-pointer bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-3 hover:border-gray-300 transition">
                  <lucide-icon name="image" class="w-4 h-4 text-gray-400 flex-none"></lucide-icon>
                  <span class="text-sm text-gray-500">{{ previewProduto() ? 'Trocar imagem' : 'Selecionar imagem' }}</span>
                  <input type="file" accept="image/*" class="hidden" (change)="onImagemProdutoChange($event)">
                </label>
              </div>

              @if (sucessoProduto()) {
                <p class="text-green-600 text-xs font-bold flex items-center gap-1">
                  <lucide-icon name="check-circle" class="w-4 h-4"></lucide-icon>
                  Produto adicionado com sucesso!
                </p>
              }
              <button type="submit" [disabled]="produtoForm.invalid || carregandoProduto()"
                class="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold py-3 rounded-xl hover:from-green-600 hover:to-teal-600 transition disabled:from-gray-200 disabled:to-gray-200 disabled:text-gray-400 flex items-center justify-center gap-2 text-sm">
                @if (carregandoProduto()) {
                  <lucide-icon name="loader" class="w-4 h-4 animate-spin"></lucide-icon> Salvando...
                } @else {
                  Adicionar Produto
                }
              </button>
            </form>
          </div>
        </div>

        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div class="p-5 border-b border-gray-50 flex items-center justify-between">
            <h2 class="font-bold text-gray-800 flex items-center gap-2">
              <lucide-icon name="clipboard-list" class="w-5 h-5 text-teal-500"></lucide-icon>
              Pedidos Recebidos
            </h2>
            <button (click)="recarregarPedidos()" class="text-gray-400 hover:text-gray-700 transition p-1 rounded-lg hover:bg-gray-100">
              <lucide-icon name="refresh-cw" class="w-4 h-4"></lucide-icon>
            </button>
          </div>
          @if (pedidos().length === 0) {
            <div class="text-center py-12 text-gray-300">
              <lucide-icon name="inbox" class="w-10 h-10 mx-auto mb-3"></lucide-icon>
              <p class="font-semibold text-sm">Nenhum pedido ainda</p>
            </div>
          }
          <div class="divide-y divide-gray-50">
            @for (pedido of pedidos(); track pedido.id) {
              <div class="p-5">
                <div class="flex items-start justify-between mb-3">
                  <div>
                    <p class="text-xs font-bold text-gray-400 uppercase tracking-widest">Pedido #{{ pedido.id }}</p>
                    <p class="font-bold text-gray-800">{{ pedido.nomeCliente }}</p>
                    <p class="text-xs text-gray-400">{{ pedido.criadoEm | date:'dd/MM/yyyy HH:mm' }}</p>
                  </div>
                  <div class="text-right">
                    <span class="text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-xl"
                          [class.bg-yellow-50]="pedido.status === 'PENDENTE'"
                          [class.text-yellow-600]="pedido.status === 'PENDENTE'"
                          [class.bg-blue-50]="pedido.status === 'CONFIRMADO'"
                          [class.text-blue-600]="pedido.status === 'CONFIRMADO'"
                          [class.bg-orange-50]="pedido.status === 'EM_PREPARO'"
                          [class.text-orange-500]="pedido.status === 'EM_PREPARO'"
                          [class.bg-teal-50]="pedido.status === 'SAIU_PARA_ENTREGA'"
                          [class.text-teal-600]="pedido.status === 'SAIU_PARA_ENTREGA'"
                          [class.bg-green-50]="pedido.status === 'ENTREGUE'"
                          [class.text-green-600]="pedido.status === 'ENTREGUE'"
                          [class.bg-red-50]="pedido.status === 'CANCELADO'"
                          [class.text-red-500]="pedido.status === 'CANCELADO'">
                      {{ getStatusLabel(pedido.status) }}
                    </span>
                    <p class="font-bold text-gray-900 mt-1">{{ pedido.total | currency:'BRL' }}</p>
                  </div>
                </div>
                <div class="bg-gray-50 rounded-xl p-3 mb-3 text-xs space-y-1">
                  @for (item of pedido.itens; track item.nomeProduto) {
                    <div class="flex justify-between text-gray-600">
                      <span>{{ item.quantidade }}x {{ item.nomeProduto }}</span>
                      <span class="font-bold">{{ item.subtotal | currency:'BRL' }}</span>
                    </div>
                  }
                </div>
                <div class="flex gap-2 flex-wrap">
                  @for (status of statusOptions; track status) {
                    @if (status !== pedido.status) {
                      <button (click)="atualizarStatus(pedido.id, status)"
                        class="text-xs font-semibold px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition">
                        {{ getStatusLabel(status) }}
                      </button>
                    }
                  }
                </div>
              </div>
            }
          </div>
        </div>

      </div>
    </div>
  `
})
export class DashboardOwnerComponent implements OnInit {
  service = inject(ApiService);
  private fb = inject(FormBuilder);

  pedidos                = signal<any[]>([]);
  meusRestaurantes      = signal<any[]>([]);
  erroRestaurante       = signal('');
  sucessoRestaurante    = signal(false);
  sucessoProduto        = signal(false);
  carregandoRestaurante = signal(false);
  carregandoProduto     = signal(false);
  tipoPratoSelecionado          = signal<string | null>(null);
  categoriaRestauranteSelecionada = signal<string | null>(null);

  previewRestaurante = signal<string | null>(null);
  previewProduto     = signal<string | null>(null);

  digitarCategoriaRestaurante = '';
  digitarCategoriaPrato = '';

  private imagemBase64Restaurante: string | null = null;
  private imagemBase64Produto: string | null = null;
  private precoEmCentavos = 0;

  precoFormatado = signal('');

  statusOptions    = STATUS_OPTIONS;
  tiposRestaurante = TIPOS_RESTAURANTE;
  tiposPrato       = TIPOS_PRATO;

  restauranteForm = this.fb.group({
    nome:      ['', Validators.required],
    descricao: [''],
    categoria: ['', Validators.required],
  });

  produtoForm = this.fb.group({
    nome:          ['', Validators.required],
    descricao:     [''],
    preco:         [null as number | null, [Validators.required, Validators.min(0.01)]],
    categoriaNome: ['', Validators.required],
    restauranteId: ['', Validators.required],
  });

  ngOnInit() {
    this.service.meusRestaurantes().subscribe(res => {
      this.meusRestaurantes.set(res);
      this.recarregarPedidos();
    });
  }

  recarregarPedidos() {
    this.meusRestaurantes().forEach(r => {
      this.service.pedidosDoRestaurante(r.id).subscribe(res => {
        this.pedidos.update(atual => [...atual.filter(p => p.restauranteId !== r.id), ...res]);
      });
    });
  }

  onPrecoInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const apenasDigitos = input.value.replace(/\D/g, '');
    this.precoEmCentavos = parseInt(apenasDigitos || '0', 10);
    const reais = this.precoEmCentavos / 100;
    const formatado = reais.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    this.precoFormatado.set(formatado);
    input.value = formatado;
    this.produtoForm.patchValue({ preco: reais });
  }

  selecionarTipoRestaurante(tipo: string) {
    this.categoriaRestauranteSelecionada.set(tipo);
    this.digitarCategoriaRestaurante = '';
    this.restauranteForm.patchValue({ categoria: tipo });
  }

  confirmarCategoriaRestaurante() {
    const valor = this.digitarCategoriaRestaurante.trim();
    if (valor) {
      this.categoriaRestauranteSelecionada.set(valor);
      this.restauranteForm.patchValue({ categoria: valor });
      this.digitarCategoriaRestaurante = '';
    }
  }

  selecionarTipoPrato(tipo: string) {
    this.tipoPratoSelecionado.set(tipo);
    this.digitarCategoriaPrato = '';
    this.produtoForm.patchValue({ categoriaNome: tipo });
  }

  confirmarCategoriaPrato() {
    const valor = this.digitarCategoriaPrato.trim();
    if (valor) {
      this.tipoPratoSelecionado.set(valor);
      this.produtoForm.patchValue({ categoriaNome: valor });
      this.digitarCategoriaPrato = '';
    }
  }

  getStatusLabel(s: string): string { return STATUS_LABELS[s] ?? s; }

  atualizarStatus(pedidoId: number, status: string) {
    this.service.atualizarStatusPedido(pedidoId, status).subscribe(() => {
      this.pedidos.update(lista => lista.map(p => p.id === pedidoId ? { ...p, status } : p));
    });
  }

  onImagemRestauranteChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.lerBase64(file, b64 => { this.imagemBase64Restaurante = b64; this.previewRestaurante.set(b64); });
  }

  removerImagemRestaurante() { this.imagemBase64Restaurante = null; this.previewRestaurante.set(null); }

  onImagemProdutoChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.lerBase64(file, b64 => { this.imagemBase64Produto = b64; this.previewProduto.set(b64); });
  }

  removerImagemProduto() { this.imagemBase64Produto = null; this.previewProduto.set(null); }

  private lerBase64(file: File, cb: (b64: string) => void) {
    const r = new FileReader();
    r.onload = () => cb(r.result as string);
    r.readAsDataURL(file);
  }

  criarRestaurante() {
    if (this.restauranteForm.invalid) return;
    this.carregandoRestaurante.set(true);
    this.erroRestaurante.set('');
    const v = this.restauranteForm.value;
    this.service.criarRestaurante({ nome: v.nome!, descricao: v.descricao ?? '', categoria: v.categoria!, imagemUrl: this.imagemBase64Restaurante ?? undefined }).subscribe({
      next: res => {
        this.carregandoRestaurante.set(false);
        this.sucessoRestaurante.set(true);
        this.restauranteForm.reset();
        this.categoriaRestauranteSelecionada.set(null);
        this.removerImagemRestaurante();
        this.meusRestaurantes.update(l => [...l, res]);
        setTimeout(() => this.sucessoRestaurante.set(false), 3000);
      },
      error: err => { this.carregandoRestaurante.set(false); this.erroRestaurante.set(err.error?.erro ?? 'Erro ao cadastrar restaurante.'); }
    });
  }

  criarProduto() {
    if (this.produtoForm.invalid) return;
    this.carregandoProduto.set(true);
    const v = this.produtoForm.value;
    this.service.criarProduto({ nome: v.nome!, descricao: v.descricao ?? '', preco: Number(v.preco), categoriaNome: v.categoriaNome!, restauranteId: Number(v.restauranteId), imagemUrl: this.imagemBase64Produto ?? undefined }).subscribe({
      next: () => {
        this.carregandoProduto.set(false);
        this.sucessoProduto.set(true);
        this.produtoForm.reset();
        this.tipoPratoSelecionado.set(null);
        this.precoEmCentavos = 0;
        this.precoFormatado.set('');
        this.removerImagemProduto();
        setTimeout(() => this.sucessoProduto.set(false), 3000);
      },
      error: () => this.carregandoProduto.set(false)
    });
  }
}