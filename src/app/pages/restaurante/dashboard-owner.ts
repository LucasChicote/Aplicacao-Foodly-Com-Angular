import { Component, inject, OnInit, signal } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { HeaderComponent } from '../../components/header/header';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';

const STATUS_OPTIONS = ['CONFIRMADO','EM_PREPARO','SAIU_PARA_ENTREGA','ENTREGUE','CANCELADO'];
const STATUS_LABELS: Record<string, string> = {
  PENDENTE: 'Pendente', CONFIRMADO: 'Confirmado', EM_PREPARO: 'Em Preparo',
  SAIU_PARA_ENTREGA: 'Saiu p/ Entrega', ENTREGUE: 'Entregue', CANCELADO: 'Cancelado'
};

@Component({
  selector: 'app-dashboard-owner',
  standalone: true,
  imports: [CommonModule, HeaderComponent, ReactiveFormsModule, LucideAngularModule],
  template: `
    <app-header />
    <div class="min-h-screen bg-gradient-to-br from-teal-50/50 via-white to-green-50/30 p-4 pt-6">
      <div class="max-w-6xl mx-auto space-y-6">

        <div class="bg-gradient-to-r from-teal-500 to-green-500 rounded-3xl p-6 text-white shadow-xl shadow-teal-200/50">
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
              <lucide-icon name="store" class="w-8 h-8 text-white"></lucide-icon>
            </div>
            <div>
              <p class="text-teal-100 text-sm font-bold">Painel do Restaurante</p>
              <h1 class="text-2xl font-black">{{ service.getNome() }}</h1>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 class="font-black text-gray-800 mb-5 flex items-center gap-2">
              <lucide-icon name="plus-circle" class="w-5 h-5 text-teal-500"></lucide-icon>
              Cadastrar Restaurante
            </h2>
            <form [formGroup]="restauranteForm" (ngSubmit)="criarRestaurante()" class="space-y-3">
              <div>
                <label class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Nome do Restaurante</label>
                <input formControlName="nome" placeholder="Ex: Cantina da Maria"
                  class="w-full bg-gray-50 border border-gray-100 rounded-xl p-3.5 text-sm outline-none focus:ring-2 focus:ring-teal-400/20 focus:border-teal-300 transition text-gray-700">
              </div>
              <div>
                <label class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Descrição</label>
                <input formControlName="descricao" placeholder="Ex: Comida caseira com sabor de lar"
                  class="w-full bg-gray-50 border border-gray-100 rounded-xl p-3.5 text-sm outline-none focus:ring-2 focus:ring-teal-400/20 focus:border-teal-300 transition text-gray-700">
              </div>
              <div>
                <label class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Categoria</label>
                <select formControlName="categoria"
                  class="w-full bg-gray-50 border border-gray-100 rounded-xl p-3.5 text-sm outline-none focus:ring-2 focus:ring-teal-400/20 focus:border-teal-300 transition text-gray-700">
                  <option value="">Selecione...</option>
                  @for (c of service.categorias(); track c.id) {
                    <option [value]="c.nome">{{ c.nome }}</option>
                  }
                </select>
              </div>

              <div>
                <label class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">
                  Imagem do Restaurante (opcional)
                </label>
                <div class="relative">
      
                  @if (previewRestaurante()) {
                    <div class="mb-3 relative">
                      <img [src]="previewRestaurante()" alt="Preview"
                        class="w-full h-36 object-cover rounded-xl border border-teal-100">
                      <button type="button" (click)="removerImagemRestaurante()"
                        class="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition">
                        <lucide-icon name="x" class="w-3.5 h-3.5"></lucide-icon>
                      </button>
                    </div>
                  }

                  <label class="flex items-center gap-3 cursor-pointer bg-teal-50 border-2 border-dashed border-teal-200 rounded-xl p-4 hover:bg-teal-100/50 hover:border-teal-300 transition">
                    <lucide-icon name="image" class="w-5 h-5 text-teal-400 flex-none"></lucide-icon>
                    <span class="text-sm text-teal-600 font-semibold">
                      {{ previewRestaurante() ? 'Trocar imagem' : 'Selecionar imagem do computador' }}
                    </span>
                    <input type="file" accept="image/*" class="hidden"
                      (change)="onImagemRestauranteChange($event)">
                  </label>
                </div>
              </div>

              @if (erroRestaurante()) {
                <p class="text-red-400 text-xs">{{ erroRestaurante() }}</p>
              }
              @if (sucessoRestaurante()) {
                <p class="text-green-600 text-xs font-bold flex items-center gap-1">
                  <lucide-icon name="check-circle" class="w-4 h-4"></lucide-icon>
                  Restaurante cadastrado!
                </p>
              }
              <button type="submit" [disabled]="restauranteForm.invalid || carregandoRestaurante()"
                class="w-full bg-gradient-to-r from-teal-500 to-green-500 text-white font-bold py-3.5 rounded-xl hover:from-teal-600 hover:to-green-600 transition disabled:from-gray-200 disabled:to-gray-200 flex items-center justify-center gap-2">
                @if (carregandoRestaurante()) {
                  <lucide-icon name="loader" class="w-4 h-4 animate-spin"></lucide-icon>
                  Salvando...
                } @else {
                  <lucide-icon name="plus" class="w-4 h-4"></lucide-icon>
                  Cadastrar Restaurante
                }
              </button>
            </form>
          </div>

          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 class="font-black text-gray-800 mb-5 flex items-center gap-2">
              <lucide-icon name="utensils" class="w-5 h-5 text-green-500"></lucide-icon>
              Adicionar Produto
            </h2>
            <form [formGroup]="produtoForm" (ngSubmit)="criarProduto()" class="space-y-3">
              <div>
                <label class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Nome do Prato</label>
                <input formControlName="nome" placeholder="Ex: Frango Grelhado"
                  class="w-full bg-gray-50 border border-gray-100 rounded-xl p-3.5 text-sm outline-none focus:ring-2 focus:ring-green-400/20 focus:border-green-300 transition text-gray-700">
              </div>
              <div>
                <label class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Descrição</label>
                <input formControlName="descricao" placeholder="Ingredientes e preparo..."
                  class="w-full bg-gray-50 border border-gray-100 rounded-xl p-3.5 text-sm outline-none focus:ring-2 focus:ring-green-400/20 focus:border-green-300 transition text-gray-700">
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Preço (R$)</label>
                  <input formControlName="preco" type="number" placeholder="35.90" step="0.01"
                    class="w-full bg-gray-50 border border-gray-100 rounded-xl p-3.5 text-sm outline-none focus:ring-2 focus:ring-green-400/20 focus:border-green-300 transition text-gray-700">
                </div>
                <div>
                  <label class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Categoria</label>
                  <select formControlName="categoriaId"
                    class="w-full bg-gray-50 border border-gray-100 rounded-xl p-3.5 text-sm outline-none focus:ring-2 focus:ring-green-400/20 focus:border-green-300 transition text-gray-700">
                    <option value="">Selecione...</option>
                    @for (c of service.categorias(); track c.id) {
                      <option [value]="c.id">{{ c.nome }}</option>
                    }
                  </select>
                </div>
              </div>
              <div>
                <label class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Restaurante</label>
                <select formControlName="restauranteId"
                  class="w-full bg-gray-50 border border-gray-100 rounded-xl p-3.5 text-sm outline-none focus:ring-2 focus:ring-green-400/20 focus:border-green-300 transition text-gray-700">
                  <option value="">Selecione...</option>
                  @for (r of meusRestaurantes(); track r.id) {
                    <option [value]="r.id">{{ r.nome }}</option>
                  }
                </select>
              </div>

              <div>
                <label class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">
                  Imagem do Produto (opcional)
                </label>
                <div class="relative">
                  @if (previewProduto()) {
                    <div class="mb-3 relative">
                      <img [src]="previewProduto()" alt="Preview"
                        class="w-full h-36 object-cover rounded-xl border border-green-100">
                      <button type="button" (click)="removerImagemProduto()"
                        class="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition">
                        <lucide-icon name="x" class="w-3.5 h-3.5"></lucide-icon>
                      </button>
                    </div>
                  }
                  <label class="flex items-center gap-3 cursor-pointer bg-green-50 border-2 border-dashed border-green-200 rounded-xl p-4 hover:bg-green-100/50 hover:border-green-300 transition">
                    <lucide-icon name="image" class="w-5 h-5 text-green-400 flex-none"></lucide-icon>
                    <span class="text-sm text-green-600 font-semibold">
                      {{ previewProduto() ? 'Trocar imagem' : 'Selecionar imagem do computador' }}
                    </span>
                    <input type="file" accept="image/*" class="hidden"
                      (change)="onImagemProdutoChange($event)">
                  </label>
                </div>
              </div>

              @if (sucessoProduto()) {
                <p class="text-green-600 text-xs font-bold flex items-center gap-1">
                  <lucide-icon name="check-circle" class="w-4 h-4"></lucide-icon>
                  Produto adicionado!
                </p>
              }
              <button type="submit" [disabled]="produtoForm.invalid || carregandoProduto()"
                class="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold py-3.5 rounded-xl hover:from-green-600 hover:to-teal-600 transition disabled:from-gray-200 disabled:to-gray-200 flex items-center justify-center gap-2">
                @if (carregandoProduto()) {
                  <lucide-icon name="loader" class="w-4 h-4 animate-spin"></lucide-icon>
                  Salvando...
                } @else {
                  <lucide-icon name="plus" class="w-4 h-4"></lucide-icon>
                  Adicionar Produto
                }
              </button>
            </form>
          </div>

        </div>

        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div class="p-5 border-b border-gray-50 flex items-center justify-between">
            <h2 class="font-black text-gray-800 flex items-center gap-2">
              <lucide-icon name="clipboard-list" class="w-5 h-5 text-teal-500"></lucide-icon>
              Pedidos Recebidos
            </h2>
            <button (click)="recarregarPedidos()" class="text-gray-400 hover:text-teal-500 transition">
              <lucide-icon name="refresh-cw" class="w-4 h-4"></lucide-icon>
            </button>
          </div>

          @if (pedidos().length === 0) {
            <div class="text-center py-12 text-gray-300">
              <lucide-icon name="inbox" class="w-10 h-10 mx-auto mb-3"></lucide-icon>
              <p class="font-bold text-sm">Nenhum pedido ainda</p>
            </div>
          }

          <div class="divide-y divide-gray-50">
            @for (pedido of pedidos(); track pedido.id) {
              <div class="p-5">
                <div class="flex items-start justify-between mb-3">
                  <div>
                    <p class="text-xs font-bold text-gray-400 uppercase tracking-widest">Pedido #{{ pedido.id }}</p>
                    <p class="font-black text-gray-800">{{ pedido.nomeCliente }}</p>
                    <p class="text-xs text-gray-400">{{ pedido.criadoEm | date:'dd/MM/yyyy HH:mm' }}</p>
                  </div>
                  <div class="text-right">
                    <span class="text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-xl"
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
                    <p class="font-black text-green-600 mt-1">{{ pedido.total | currency:'BRL' }}</p>
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
                        class="text-xs font-bold px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-teal-50 hover:text-teal-600 transition">
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
  service        = inject(ApiService);
  private fb     = inject(FormBuilder);

  pedidos         = signal<any[]>([]);
  meusRestaurantes = signal<any[]>([]);
  erroRestaurante = signal('');
  sucessoRestaurante = signal(false);
  sucessoProduto  = signal(false);
  carregandoRestaurante = signal(false);
  carregandoProduto = signal(false);

  previewRestaurante = signal<string | null>(null);
  previewProduto     = signal<string | null>(null);

  private imagemBase64Restaurante: string | null = null;
  private imagemBase64Produto: string | null = null;

  statusOptions = STATUS_OPTIONS;

  restauranteForm = this.fb.group({
    nome:      ['', Validators.required],
    descricao: [''],
    categoria: ['', Validators.required],
  });

  produtoForm = this.fb.group({
    nome:          ['', Validators.required],
    descricao:     [''],
    preco:         [null, [Validators.required, Validators.min(0.01)]],
    categoriaId:   ['', Validators.required],
    restauranteId: ['', Validators.required],
  });

  ngOnInit() {
    this.service.listarCategorias();
    this.service.meusRestaurantes().subscribe(res => this.meusRestaurantes.set(res));
    this.recarregarPedidos();
  }

  recarregarPedidos() {
    this.meusRestaurantes().forEach(r => {
      this.service.pedidosDoRestaurante(r.id).subscribe(res => {
        this.pedidos.update(atual => {
          const filtrado = atual.filter(p => p.restauranteId !== r.id);
          return [...filtrado, ...res];
        });
      });
    });
  }

  getStatusLabel(s: string): string { return STATUS_LABELS[s] ?? s; }

  atualizarStatus(pedidoId: number, status: string) {
    this.service.atualizarStatusPedido(pedidoId, status).subscribe(() => {
      this.pedidos.update(lista =>
        lista.map(p => p.id === pedidoId ? { ...p, status } : p)
      );
    });
  }

  onImagemRestauranteChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.lerArquivoComoBase64(file, (base64) => {
      this.imagemBase64Restaurante = base64;
      this.previewRestaurante.set(base64);
    });
  }

  removerImagemRestaurante() {
    this.imagemBase64Restaurante = null;
    this.previewRestaurante.set(null);
  }

  onImagemProdutoChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.lerArquivoComoBase64(file, (base64) => {
      this.imagemBase64Produto = base64;
      this.previewProduto.set(base64);
    });
  }

  removerImagemProduto() {
    this.imagemBase64Produto = null;
    this.previewProduto.set(null);
  }

  private lerArquivoComoBase64(file: File, callback: (base64: string) => void) {
    const reader = new FileReader();
    reader.onload = () => callback(reader.result as string);
    reader.readAsDataURL(file);
  }

  criarRestaurante() {
    if (this.restauranteForm.invalid) return;
    this.carregandoRestaurante.set(true);
    this.erroRestaurante.set('');

    const v = this.restauranteForm.value;
    const dados = {
      nome:      v.nome!,
      descricao: v.descricao ?? '',
      categoria: v.categoria!,
      imagemUrl: this.imagemBase64Restaurante ?? undefined,
    };

    this.service.criarRestaurante(dados).subscribe({
      next: (res) => {
        this.carregandoRestaurante.set(false);
        this.sucessoRestaurante.set(true);
        this.restauranteForm.reset();
        this.removerImagemRestaurante();
        this.meusRestaurantes.update(lista => [...lista, res]);
        setTimeout(() => this.sucessoRestaurante.set(false), 3000);
      },
      error: (err) => {
        this.carregandoRestaurante.set(false);
        this.erroRestaurante.set(err.error?.erro ?? 'Erro ao cadastrar restaurante.');
      }
    });
  }

  criarProduto() {
    if (this.produtoForm.invalid) return;
    this.carregandoProduto.set(true);

    const v = this.produtoForm.value;
    const dados = {
      nome:          v.nome!,
      descricao:     v.descricao ?? '',
      preco:         Number(v.preco),
      categoriaId:   Number(v.categoriaId),
      restauranteId: Number(v.restauranteId),
      imagemUrl:     this.imagemBase64Produto ?? undefined,
    };

    this.service.criarProduto(dados).subscribe({
      next: () => {
        this.carregandoProduto.set(false);
        this.sucessoProduto.set(true);
        this.produtoForm.reset();
        this.removerImagemProduto();
        this.service.listarProdutos();
        setTimeout(() => this.sucessoProduto.set(false), 3000);
      },
      error: () => {
        this.carregandoProduto.set(false);
      }
    });
  }
}