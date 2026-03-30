import { Component, input, output, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all p-5 flex gap-5 group">
      
      <div class="w-28 h-28 bg-orange-50 rounded-[1.5rem] overflow-hidden flex items-center justify-center flex-none group-hover:bg-orange-100 transition-colors">
        @if (item().fotoUrl) {
          <img [src]="item().fotoUrl" [alt]="item().nome" class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500">
        } @else {
          <lucide-icon name="utensils" class="text-orange-200 w-10 h-10"></lucide-icon>
        }
      </div>
      
      <div class="flex-grow flex flex-col justify-between py-1">
        <div>
          <h3 class="font-black text-gray-800 text-lg">{{ item().nome }}</h3>
          <p class="text-xs text-gray-400 mt-1 line-clamp-2">{{ item().descricao || 'Ingredientes selecionados com qualidade.' }}</p>
        </div>
        
        <div class="flex items-center justify-between">
          <span class="font-black text-xl text-orange-600">{{ item().preco | currency:'BRL' }}</span>
          <button (click)="adicionar.emit(item())" 
            class="bg-orange-500 text-white w-10 h-10 rounded-2xl flex items-center justify-center hover:bg-orange-600 shadow-lg shadow-orange-100 active:scale-90 transition">
            <lucide-icon name="plus" class="w-5 h-5"></lucide-icon>
          </button>
        </div>
      </div>
    </div>
  `
})
export class TodoItemComponent {
  item = input.required<any>(); 
  adicionar = output<any>();    
}