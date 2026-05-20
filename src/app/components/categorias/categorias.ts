import { Component, inject, OnInit, output } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [LucideAngularModule],
  template: `
    <div class="flex gap-3 overflow-x-auto pb-3 no-scrollbar my-5">

      <button (click)="selecionarTodos()"
        class="flex-none flex flex-col items-center gap-2 cursor-pointer">
        <div class="w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all"
             [class.border-red-400]="!categoriaSelecionada"
             [class.bg-red-50]="!categoriaSelecionada"
             [class.border-gray-200]="!!categoriaSelecionada"
             [class.bg-white]="!!categoriaSelecionada">
          <lucide-icon name="grid-3x3" class="w-5 h-5" [class.text-red-500]="!categoriaSelecionada" [class.text-gray-400]="!!categoriaSelecionada"></lucide-icon>
        </div>
        <span class="text-xs font-semibold"
              [class.text-red-500]="!categoriaSelecionada"
              [class.text-gray-500]="!!categoriaSelecionada">Todos</span>
      </button>

      @for (c of service.categorias(); track c.id) {
        <button (click)="selecionar(c)"
          class="flex-none flex flex-col items-center gap-2 cursor-pointer">
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all"
               [class.border-red-400]="categoriaSelecionada?.id === c.id"
               [class.bg-red-50]="categoriaSelecionada?.id === c.id"
               [class.border-gray-200]="categoriaSelecionada?.id !== c.id"
               [class.bg-white]="categoriaSelecionada?.id !== c.id">
            <lucide-icon name="tag" class="w-5 h-5" [class.text-red-500]="categoriaSelecionada?.id === c.id" [class.text-gray-400]="categoriaSelecionada?.id !== c.id"></lucide-icon>
          </div>
          <span class="text-xs font-semibold"
                [class.text-red-500]="categoriaSelecionada?.id === c.id"
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

  selecionar(c: any) {
    this.categoriaSelecionada = c;
    this.categoriaChange.emit(c);
  }

  selecionarTodos() {
    this.categoriaSelecionada = null;
    this.categoriaChange.emit(null);
  }
}
