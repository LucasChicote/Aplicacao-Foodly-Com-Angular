import { Component, input, output, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-4 bg-white rounded shadow mb-4 flex justify-between items-center">
      <div>
        <h3 class="font-bold">{{ item().nome }}</h3>
        <p class="text-gray-600">{{ item().preco | currency:'BRL' }}</p>
      </div>
      <div class="flex items-center gap-2">
        <input type="number" [(ngModel)]="quantidade" class="w-12 border rounded p-1">
        <button (click)="adicionar.emit(item())" class="bg-orange-500 text-white p-2 rounded">＋</button>
      </div>
    </div>
  `
})
export class TodoItemComponent {
  item = input.required<any>(); 
  adicionar = output<any>();    
  quantidade = model(1);        
}