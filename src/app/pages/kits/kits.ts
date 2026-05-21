import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { HeaderComponent } from '../../components/header/header';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

const KIT_TIPOS = [
  { id: 'salgados',       label: 'Salgados',        icon: 'sandwich',    cor: 'bg-amber-50 border-amber-200 text-amber-700', corBtn: 'bg-amber-500' },
  { id: 'doces',          label: 'Doces',            icon: 'cake',        cor: 'bg-pink-50 border-pink-200 text-pink-700',   corBtn: 'bg-pink-500' },
  { id: 'bebidas',        label: 'Bebidas',          icon: 'coffee',      cor: 'bg-blue-50 border-blue-200 text-blue-700',   corBtn: 'bg-blue-500' },
  { id: 'cafe-da-manha',  label: 'Café da Manhã',    icon: 'sunrise',     cor: 'bg-orange-50 border-orange-200 text-orange-700', corBtn: 'bg-orange-500' },
  { id: 'almoco',         label: 'Kit Almoço',       icon: 'utensils',    cor: 'bg-green-50 border-green-200 text-green-700', corBtn: 'bg-green-500' },
  { id: 'lanches',        label: 'Lanches',          icon: 'hamburger',   cor: 'bg-yellow-50 border-yellow-200 text-yellow-700', corBtn: 'bg-yellow-500' },
  { id: 'variados',       label: 'Variados',         icon: 'package',     cor: 'bg-teal-50 border-teal-200 text-teal-700',  corBtn: 'bg-teal-500' },
];

const CO2_POR_KG = 2.5;
const PRECO_KIT_DESCONTO = 0.6;

@Component({
  selector: 'app-kits',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FormsModule, LucideAngularModule],
  template: `
    <app-header />
    <div class="min-h-screen bg-gray-50">
      <main class="max-w-7xl mx-auto p-4 lg:p-6">

        <div class="bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl p-6 mb-6 text-white">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-none">
              <lucide-icon name="recycle" class="w-6 h-6 text-white"></lucide-icon>
            </div>
            <div class="flex-1">
              <h1 class="text-xl font-black mb-1">Kits Sustentáveis</h1>
              <p class="text-white/80 text-sm leading-relaxed">
                Produtos próximos da validade ou cancelados de outros pedidos — agrupados em kits com preço reduzido.
                Comprar aqui ajuda a reduzir o desperdício e diminui a emissão de CO₂ no planeta.
              </p>
            </div>
          </div>
          <div class="mt-4 grid grid-cols-3 gap-3">
            <div class="bg-white/15 rounded-xl p-3 text-center">
              <p class="text-xl font-black">{{ kitsDisponiveis().length }}</p>
              <p class="text-white/70 text-xs">Kits disponíveis</p>
            </div>
            <div class="bg-white/15 rounded-xl p-3 text-center">
              <p class="text-xl font-black">{{ totalCO2Evitado().toFixed(1) }}kg</p>
              <p class="text-white/70 text-xs">CO₂ a evitar</p>
            </div>
            <div class="bg-white/15 rounded-xl p-3 text-center">
              <p class="text-xl font-black">{{ descontoMedio() }}%</p>
              <p class="text-white/70 text-xs">Desconto médio</p>
            </div>
          </div>
        </div>

        <div class="flex gap-2 overflow-x-auto pb-2 mb-6 no-scrollbar">
          <button (click)="filtroTipo = null"
            class="flex-none px-4 py-2 rounded-full text-sm font-semibold border transition whitespace-nowrap"
            [class.bg-green-600]="filtroTipo === null" [class.text-white]="filtroTipo === null"
            [class.border-green-600]="filtroTipo === null" [class.bg-white]="filtroTipo !== null"
            [class.text-gray-600]="filtroTipo !== null" [class.border-gray-200]="filtroTipo !== null">
            Todos
          </button>
          @for (kt of kitTipos; track kt.id) {
            <button (click)="filtroTipo = kt.id"
              class="flex-none px-4 py-2 rounded-full text-sm font-semibold border transition whitespace-nowrap"
              [class.bg-green-600]="filtroTipo === kt.id" [class.text-white]="filtroTipo === kt.id"
              [class.border-green-600]="filtroTipo === kt.id" [class.bg-white]="filtroTipo !== kt.id"
              [class.text-gray-600]="filtroTipo !== kt.id" [class.border-gray-200]="filtroTipo !== kt.id">
              {{ kt.label }}
            </button>
          }
        </div>

        @if (kitsFiltrados().length === 0) {
          <div class="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <lucide-icon name="package" class="w-12 h-12 text-gray-200 mx-auto mb-3"></lucide-icon>
            <p class="font-bold text-gray-400">Nenhum kit disponível no momento</p>
            <p class="text-gray-300 text-sm mt-1">Os restaurantes ainda não adicionaram produtos para kit</p>
          </div>
        }

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-10">
          @for (kit of kitsFiltrados(); track kit.id) {
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
              <div class="relative">
                <div class="w-full h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
                  @if (kit.imagemUrl) {
                    <img [src]="kit.imagemUrl" [alt]="kit.nome" class="w-full h-full object-cover">
                  } @else {
                    <lucide-icon name="package" class="w-12 h-12 text-gray-300"></lucide-icon>
                  }
                </div>
                <div class="absolute top-2 left-2 bg-green-500 text-white text-xs font-black px-2.5 py-1 rounded-full">
                  -{{ kit.desconto }}%
                </div>
                <div class="absolute top-2 right-2 bg-white/90 backdrop-blur text-xs font-bold text-teal-700 px-2 py-1 rounded-full border border-teal-100 flex items-center gap-1">
                  <lucide-icon name="leaf" class="w-3 h-3"></lucide-icon>
                  -{{ kit.co2 }}kg CO₂
                </div>
              </div>
              <div class="p-4">
                <span class="text-[10px] font-bold text-green-600 uppercase tracking-widest">{{ kit.tipoLabel }}</span>
                <h3 class="font-bold text-gray-900 text-sm mt-0.5">{{ kit.nome }}</h3>
                <p class="text-xs text-gray-400 mt-1 line-clamp-2">{{ kit.descricao }}</p>
                <div class="flex items-center gap-1 mt-1.5 text-xs text-gray-400">
                  <lucide-icon name="store" class="w-3 h-3"></lucide-icon>
                  <span>{{ kit.restaurante }}</span>
                </div>
                <div class="flex items-center justify-between mt-3">
                  <div>
                    <p class="text-[10px] text-gray-400 line-through">{{ kit.precoOriginal | currency:'BRL' }}</p>
                    <p class="font-black text-gray-900 text-lg leading-none">{{ kit.precoKit | currency:'BRL' }}</p>
                  </div>
                  <button (click)="adicionarKit(kit)"
                    class="bg-green-500 text-white w-9 h-9 rounded-xl flex items-center justify-center hover:bg-green-600 active:scale-90 transition-all">
                    <lucide-icon name="plus" class="w-4 h-4"></lucide-icon>
                  </button>
                </div>
              </div>
            </div>
          }
        </div>

        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <h2 class="font-bold text-gray-900 text-base mb-1 flex items-center gap-2">
            <lucide-icon name="calculator" class="w-5 h-5 text-green-500"></lucide-icon>
            Calculadora de Impacto CO₂
          </h2>
          <p class="text-gray-400 text-sm mb-5">Veja o quanto você pode ajudar o planeta evitando o desperdício de alimentos.</p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div class="space-y-4">
              <div>
                <label class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">
                  Quantidade de alimento (kg)
                </label>
                <input type="number" [(ngModel)]="calcKg" min="0.1" step="0.1" placeholder="Ex: 2.5"
                  class="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-green-400/20 focus:border-green-400 transition text-gray-700 text-sm">
              </div>
              <div>
                <label class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">
                  Tipo de alimento
                </label>
                <select [(ngModel)]="calcTipo"
                  class="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-green-400/20 focus:border-green-400 transition text-gray-700 text-sm">
                  @for (op of opcoesCO2; track op.label) {
                    <option [value]="op.fator">{{ op.label }} ({{ op.fator }} kg CO₂/kg)</option>
                  }
                </select>
              </div>
            </div>

            <div class="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-5 border border-green-100 flex flex-col justify-center">
              @if (calcKg && calcTipo) {
                <div class="text-center">
                  <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">CO₂ evitado</p>
                  <p class="text-5xl font-black text-green-600 mb-1">{{ (calcKg * calcTipo).toFixed(2) }}</p>
                  <p class="text-green-600 font-semibold">kg de CO₂</p>
                  <div class="mt-4 space-y-2 text-sm text-gray-500">
                    <p>Equivale a <strong class="text-gray-700">{{ calcEquivalencias().km }} km</strong> em carro</p>
                    <p>Ou <strong class="text-gray-700">{{ calcEquivalencias().arvores }} árvores</strong> plantadas por 1 ano</p>
                    <p>Ou <strong class="text-gray-700">{{ calcEquivalencias().chuveiro }} banhos</strong> a menos de chuveiro elétrico</p>
                  </div>
                </div>
              } @else {
                <div class="text-center text-gray-300">
                  <lucide-icon name="leaf" class="w-12 h-12 mx-auto mb-3"></lucide-icon>
                  <p class="text-sm font-semibold">Preencha os campos para ver o impacto</p>
                </div>
              }
            </div>
          </div>
        </div>

      </main>
    </div>
  `,
  styles: `.no-scrollbar::-webkit-scrollbar { display: none; }`
})
export class KitsComponent implements OnInit {
  service = inject(ApiService);
  router  = inject(Router);

  filtroTipo: string | null = null;
  kitTipos = KIT_TIPOS;

  calcKg: number | null = null;
  calcTipo: number | null = null;

  opcoesCO2 = [
    { label: 'Carnes e Proteínas',  fator: 6.0 },
    { label: 'Laticínios',          fator: 3.2 },
    { label: 'Frutas e Vegetais',   fator: 0.8 },
    { label: 'Grãos e Cereais',     fator: 1.5 },
    { label: 'Pão e Massas',        fator: 1.2 },
    { label: 'Bebidas',             fator: 0.5 },
    { label: 'Misto/Geral',         fator: 2.5 },
  ];

  kitsDisponiveis = signal<any[]>([]);

  totalCO2Evitado = computed(() =>
    this.kitsDisponiveis().reduce((acc, k) => acc + (k.co2 ?? 0), 0)
  );

  descontoMedio = computed(() => {
    const kits = this.kitsDisponiveis();
    if (!kits.length) return 0;
    return Math.round(kits.reduce((acc, k) => acc + (k.desconto ?? 40), 0) / kits.length);
  });

  kitsFiltrados = computed(() => {
    if (!this.filtroTipo) return this.kitsDisponiveis();
    return this.kitsDisponiveis().filter(k => k.tipo === this.filtroTipo);
  });

  calcEquivalencias = computed(() => {
    if (!this.calcKg || !this.calcTipo) return { km: 0, arvores: 0, chuveiro: 0 };
    const co2 = this.calcKg * this.calcTipo;
    return {
      km:       Math.round(co2 / 0.21),
      arvores:  Math.round(co2 / 21),
      chuveiro: Math.round(co2 / 0.08),
    };
  });

  ngOnInit() {
    this.service.listarTodosProdutosObs().subscribe(produtos => {
      const restaurantes = this.service.restaurantes();
      const kits = produtos.map((p, i) => {
        const tipo = this.mapearTipo(p.categoria);
        const tipoInfo = KIT_TIPOS.find(kt => kt.id === tipo) ?? KIT_TIPOS[6];
        const desconto = 30 + (i % 5) * 5;
        const precoOriginal = p.preco ?? 20;
        const precoKit = +(precoOriginal * (1 - desconto / 100)).toFixed(2);
        const restauranteObj = restaurantes.find(r => r.id === p.restauranteId);
        return {
          id: p.id, nome: p.nome, descricao: p.descricao, imagemUrl: p.imagemUrl,
          tipo, tipoLabel: tipoInfo.label, precoOriginal, precoKit, desconto,
          co2: +(Math.random() * 0.8 + 0.2).toFixed(2),
          restaurante: restauranteObj?.nome ?? p.restaurante ?? 'Restaurante',
          restauranteId: p.restauranteId,
        };
      });
      this.kitsDisponiveis.set(kits);
    });
  }

  private mapearTipo(categoria: string | null): string {
    if (!categoria) return 'variados';
    const c = categoria.toLowerCase();
    if (c.includes('bebida') || c.includes('suco') || c.includes('café')) return 'bebidas';
    if (c.includes('doce') || c.includes('sobremesa') || c.includes('bolo')) return 'doces';
    if (c.includes('salgado') || c.includes('entrada') || c.includes('frito')) return 'salgados';
    if (c.includes('café da manhã') || c.includes('manha')) return 'cafe-da-manha';
    if (c.includes('almoço') || c.includes('prato principal') || c.includes('almoco')) return 'almoco';
    if (c.includes('lanche') || c.includes('hambúrguer') || c.includes('sanduíche')) return 'lanches';
    return 'variados';
  }

  adicionarKit(kit: any) {
    this.service.adicionarAoCarrinho({ ...kit, preco: kit.precoKit, id: kit.id });
    this.router.navigate(['/restaurante', kit.restauranteId]);
  }
}
