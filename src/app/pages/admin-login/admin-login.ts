import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../service/api.service';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink, LucideAngularModule],
  template: `
    <div class="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div class="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-sm">

        <div class="flex items-center gap-3 mb-8">
          <div class="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center">
            <lucide-icon name="shield" class="w-5 h-5 text-gray-400"></lucide-icon>
          </div>
          <div>
            <p class="text-xs font-bold text-gray-500 uppercase tracking-widest">Acesso Restrito</p>
            <h2 class="text-lg font-black text-white">Painel Administrativo</h2>
          </div>
        </div>

        @if (erro()) {
          <div class="bg-red-900/30 border border-red-800 text-red-400 text-sm rounded-xl px-4 py-3 mb-5">
            {{ erro() }}
          </div>
        }

        <form [formGroup]="form" (ngSubmit)="entrar()" class="space-y-4">
          <div>
            <label class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">E-mail</label>
            <input formControlName="email" type="email" placeholder="admin@foodly.com"
              class="w-full bg-gray-800 border border-gray-700 rounded-xl p-3.5 outline-none focus:border-gray-500 transition text-gray-200 text-sm placeholder:text-gray-600">
          </div>
          <div>
            <label class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Senha</label>
            <input formControlName="senha" type="password" placeholder="••••••••"
              class="w-full bg-gray-800 border border-gray-700 rounded-xl p-3.5 outline-none focus:border-gray-500 transition text-gray-200 text-sm placeholder:text-gray-600">
          </div>
          <button type="submit" [disabled]="form.invalid || carregando()"
            class="w-full bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-600 text-white font-bold py-3.5 rounded-xl transition text-sm flex items-center justify-center gap-2">
            @if (carregando()) {
              <lucide-icon name="loader" class="w-4 h-4 animate-spin"></lucide-icon>
            }
            Entrar
          </button>
        </form>

        <div class="mt-6 text-center">
          <a routerLink="/login" class="text-xs text-gray-600 hover:text-gray-400 transition">
            Voltar ao login público
          </a>
        </div>
      </div>
    </div>
  `
})
export class AdminLoginComponent {
  private fb     = inject(FormBuilder);
  private router = inject(Router);
  private service = inject(ApiService);

  carregando = signal(false);
  erro = signal('');

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', Validators.required]
  });

  entrar() {
    if (this.form.invalid) return;
    this.carregando.set(true);
    this.erro.set('');
    this.service.login(this.form.value as any).subscribe({
      next: (res: any) => {
        this.carregando.set(false);
        if (res.role !== 'ROLE_ADMIN' && res.role !== 'ROLE_RESTAURANT_OWNER') {
          this.erro.set('Acesso não autorizado para este painel.');
          return;
        }
        this.service.salvarSessao(res.token, res.nome, res.email, res.role);
        if (res.role === 'ROLE_ADMIN') this.router.navigate(['/admin']);
        else this.router.navigate(['/dashboard-owner']);
      },
      error: () => {
        this.carregando.set(false);
        this.erro.set('Credenciais inválidas.');
      }
    });
  }
}
