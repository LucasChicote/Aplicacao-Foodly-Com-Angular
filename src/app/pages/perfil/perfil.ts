import { Component, inject, signal, OnInit } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { HeaderComponent } from '../../components/header/header';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, HeaderComponent, ReactiveFormsModule],
  template: `
    <app-header />
    <div class="min-h-screen bg-gradient-to-br from-green-50/50 via-white to-teal-50/30 p-4 pt-8">
      <div class="max-w-2xl mx-auto space-y-5">

        <div class="bg-gradient-to-r from-green-500 to-teal-500 rounded-[2.5rem] p-8 text-white shadow-xl shadow-green-200/50">
          <div class="flex items-center gap-5">
            <div class="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center text-5xl shadow-inner">
              {{ getRoleEmoji() }}
            </div>
            <div>
              <h1 class="text-2xl font-black">{{ service.getNome() }}</h1>
              <p class="text-green-100 text-sm mt-1">{{ service.getEmail() }}</p>
              <span class="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full mt-2 uppercase tracking-wide">
                {{ getRoleLabel() }}
              </span>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="font-black text-gray-800 text-lg">✏️ Meus Dados</h2>
            @if (!editando()) {
              <button (click)="editando.set(true)"
                class="text-sm font-bold text-green-600 hover:text-green-700 bg-green-50 px-4 py-2 rounded-full transition">
                Editar
              </button>
            }
          </div>

          @if (sucesso()) {
            <div class="bg-green-50 border border-green-100 text-green-700 text-sm rounded-2xl px-4 py-3 mb-4 text-center font-bold">
              ✅ Dados atualizados com sucesso!
            </div>
          }

          <form [formGroup]="perfilForm" (ngSubmit)="salvarPerfil()" class="space-y-4">
            <div>
              <label class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Nome</label>
              <input formControlName="nome"
                class="w-full rounded-2xl p-4 border transition-all outline-none"
                [class.bg-gray-50]="!editando()"
                [class.bg-white]="editando()"
                [class.border-gray-100]="!editando()"
                [class.border-green-200]="editando()"
                [class.focus:ring-2]="editando()"
                [class.focus:ring-green-400/20]="editando()"
                [readOnly]="!editando()">
            </div>
            <div>
              <label class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">CEP</label>
              <input formControlName="cep" (input)="editando() && buscarCep()"
                class="w-full rounded-2xl p-4 border transition-all outline-none"
                [class.bg-gray-50]="!editando()"
                [class.bg-white]="editando()"
                [class.border-gray-100]="!editando()"
                [class.border-green-200]="editando()"
                [readOnly]="!editando()" maxlength="8">
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Rua</label>
                <input formControlName="rua" [readOnly]="true"
                  class="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-gray-400 cursor-not-allowed outline-none">
              </div>
              <div>
                <label class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Bairro</label>
                <input formControlName="bairro" [readOnly]="true"
                  class="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-gray-400 cursor-not-allowed outline-none">
              </div>
            </div>

            @if (editando()) {
              <div class="flex gap-3 pt-2">
                <button type="submit" [disabled]="perfilForm.invalid"
                  class="flex-1 bg-gradient-to-r from-green-500 to-teal-500 text-white font-black py-4 rounded-2xl hover:from-green-600 hover:to-teal-600 transition shadow-md shadow-green-200 disabled:from-gray-200 disabled:to-gray-200">
                  Salvar
                </button>
                <button type="button" (click)="cancelarEdicao()"
                  class="flex-1 bg-gray-50 text-gray-500 font-black py-4 rounded-2xl hover:bg-gray-100 transition">
                  Cancelar
                </button>
              </div>
            }
          </form>
        </div>

        <div class="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="font-black text-gray-800 text-lg">🔐 Alterar Senha</h2>
            @if (!alterandoSenha()) {
              <button (click)="alterandoSenha.set(true)"
                class="text-sm font-bold text-green-600 hover:text-green-700 bg-green-50 px-4 py-2 rounded-full transition">
                Alterar
              </button>
            }
          </div>

          @if (alterandoSenha()) {
            <form [formGroup]="senhaForm" (ngSubmit)="salvarSenha()" class="space-y-4">
              <div>
                <label class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Nova Senha</label>
                <div class="relative">
                  <input formControlName="novaSenha" [type]="mostrarNovaSenha() ? 'text' : 'password'" placeholder="Mínimo 6 caracteres"
                    class="w-full bg-gray-50 border border-green-200 rounded-2xl p-4 pr-14 outline-none focus:ring-2 focus:ring-green-400/20 focus:border-green-300 transition text-gray-700">
                  <button type="button" (click)="mostrarNovaSenha.update(v => !v)"
                    class="absolute right-4 top-1/2 -translate-y-1/2 text-xl">
                    {{ mostrarNovaSenha() ? '🙈' : '👁️' }}
                  </button>
                </div>
              </div>
              <div>
                <label class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Confirmar Senha</label>
                <input formControlName="confirmar" [type]="mostrarNovaSenha() ? 'text' : 'password'" placeholder="Repita a senha"
                  class="w-full bg-gray-50 border border-green-200 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-green-400/20 focus:border-green-300 transition text-gray-700">
              </div>
              @if (senhaForm.get('confirmar')?.value && senhaForm.get('novaSenha')?.value !== senhaForm.get('confirmar')?.value) {
                <p class="text-red-400 text-xs ml-2">As senhas não coincidem</p>
              }
              <div class="flex gap-3">
                <button type="submit"
                  [disabled]="senhaForm.invalid || senhaForm.get('novaSenha')?.value !== senhaForm.get('confirmar')?.value"
                  class="flex-1 bg-gradient-to-r from-green-500 to-teal-500 text-white font-black py-4 rounded-2xl hover:from-green-600 hover:to-teal-600 transition shadow-md shadow-green-200 disabled:from-gray-200 disabled:to-gray-200">
                  Salvar Senha
                </button>
                <button type="button" (click)="alterandoSenha.set(false)"
                  class="flex-1 bg-gray-50 text-gray-500 font-black py-4 rounded-2xl hover:bg-gray-100 transition">
                  Cancelar
                </button>
              </div>
            </form>
          } @else {
            <p class="text-sm text-gray-400">••••••••••• <span class="text-green-500">●</span></p>
          }
        </div>

        <button (click)="router.navigate(['/home'])"
          class="w-full text-gray-400 font-bold py-3 text-sm hover:text-gray-600 transition text-center">
          ← Voltar ao cardápio
        </button>

      </div>
    </div>
  `
})
export class PerfilComponent implements OnInit {
  service = inject(ApiService);
  router = inject(Router);
  private fb = inject(FormBuilder);

  editando = signal(false);
  alterandoSenha = signal(false);
  mostrarNovaSenha = signal(false);
  sucesso = signal(false);

  perfilForm = this.fb.group({
    nome:   ['', Validators.required],
    cep:    [''],
    rua:    [{ value: '', disabled: true }],
    bairro: [{ value: '', disabled: true }]
  });

  senhaForm = this.fb.group({
    novaSenha: ['', [Validators.required, Validators.minLength(6)]],
    confirmar: ['', Validators.required]
  });

  ngOnInit() {
    this.perfilForm.patchValue({
      nome: this.service.getNome()
    });
  }

  getRoleEmoji(): string {
    const r = this.service.getRole();
    if (r === 'ROLE_ADMIN') return '⚙️';
    if (r === 'ROLE_RESTAURANT_OWNER') return '🍽️';
    return '👤';
  }

  getRoleLabel(): string {
    const r = this.service.getRole();
    if (r === 'ROLE_ADMIN') return 'Administrador';
    if (r === 'ROLE_RESTAURANT_OWNER') return 'Restaurante';
    return 'Cliente';
  }

  buscarCep() {
    const cep = this.perfilForm.get('cep')?.value;
    if (cep && cep.length === 8) {
      this.service.buscarCep(cep).subscribe(res => {
        this.perfilForm.patchValue({ rua: res.logradouro, bairro: res.bairro });
      });
    }
  }

  salvarPerfil() {
    const nome = this.perfilForm.get('nome')?.value ?? '';
    localStorage.setItem('nome', nome);
    this.editando.set(false);
    this.sucesso.set(true);
    setTimeout(() => this.sucesso.set(false), 3000);
  }

  cancelarEdicao() {
    this.editando.set(false);
    this.perfilForm.patchValue({ nome: this.service.getNome() });
  }

  salvarSenha() {
    this.alterandoSenha.set(false);
    this.senhaForm.reset();
    this.sucesso.set(true);
    setTimeout(() => this.sucesso.set(false), 3000);
  }
}