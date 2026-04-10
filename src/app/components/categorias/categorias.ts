import { Component, inject, OnInit, output } from '@angular/core';
import { ApiService } from '../../service/api.service';

const EMOJIS: Record<string, string> = {
  'Lanches': '🍔', 'Bebidas': '🥤', 'Sobremesas': '🍦',
  'Saudáveis': '🥗', 'Fast Food': '🍟', 'Japonesa': '🍣',
  'Italiana': '🍕', 'Brasileira': '🍖', 'Promoções': '🏷️'
};

@Component({
  selector: 'app-categorias',
  standalone: true,
  template: `
    <div class="flex gap-3 overflow-x-auto pb-3 no-scrollbar my-6">

      <button (click)="selecionarTodos()"
        class="flex-none flex flex-col items-center gap-2 cursor-pointer group">
        <div class="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl border-2 transition-all"
             [class.border-green-400]="!categoriaSelecionada"
             [class.bg-green-50]="!categoriaSelecionada"
             [class.shadow-md]="!categoriaSelecionada"
             [class.shadow-green-100]="!categoriaSelecionada"
             [class.border-gray-100]="!!categoriaSelecionada"
             [class.bg-white]="!!categoriaSelecionada">
          🍽️
        </div>
        <span class="text-xs font-bold transition"
              [class.text-green-600]="!categoriaSelecionada"
              [class.text-gray-500]="!!categoriaSelecionada">Todos</span>
      </button>

      @for (c of service.categorias(); track c.id) {
        <button (click)="selecionar(c)"
          class="flex-none flex flex-col items-center gap-2 cursor-pointer group">
          <div class="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl border-2 transition-all"
               [class.border-green-400]="categoriaSelecionada?.id === c.id"
               [class.bg-green-50]="categoriaSelecionada?.id === c.id"
               [class.shadow-md]="categoriaSelecionada?.id === c.id"
               [class.shadow-green-100]="categoriaSelecionada?.id === c.id"
               [class.border-gray-100]="categoriaSelecionada?.id !== c.id"
               [class.bg-white]="categoriaSelecionada?.id !== c.id"
               [class.group-hover:border-green-300]="true">
            {{ getEmoji(c.nome) }}
          </div>
          <span class="text-xs font-bold transition"
                [class.text-green-600]="categoriaSelecionada?.id === c.id"
                [class.text-gray-500]="categoriaSelecionada?.id !== c.id">
            {{ c.nome }}
          </span>
        </button>
      }
    </div>
  `,
  styles: `.no-scrollbar::-webkit-scrollbar { display: none; }`
})
export class CategoriasComponent implements OnInit {
  service = inject(ApiService);
  categoriaChange = output<any>();
  categoriaSelecionada: any = null;

  ngOnInit() { this.service.listarCategorias(); }

  getEmoji(nome: string): string { return EMOJIS[nome] ?? '♥'; }

  selecionar(c: any) {
    this.categoriaSelecionada = c;
    this.categoriaChange.emit(c);
  }

  selecionarTodos() {
    this.categoriaSelecionada = null;
    this.categoriaChange.emit(null);
  }
}