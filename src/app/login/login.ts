import { Component, inject } from '@angular/core'; 
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../service/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private service: ApiService = inject(ApiService);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required]]
  });

  entrar() {
    if (this.loginForm.valid) {
      const dadosLogin = this.loginForm.value;

      this.service.login(dadosLogin).subscribe({
        next: (res: any) => {
          if (res?.token) {
            localStorage.setItem('token', res.token);
            this.router.navigate(['/home']);
          } else {
            console.error('Resposta do servidor sem token:', res);
            alert('Erro: O servidor não enviou o token de acesso.');
          }
        },
        error: (err: any) => {
          console.error('Detalhes do erro:', err);
          if (err.status === 403) {
            alert('Acesso negado (403). Verifique suas credenciais ou a configuração de CORS no Back-end.');
          } else {
            alert('Erro ao logar! Verifique se o banco de dados e o Back-end estão rodando corretamente.');
          }
        }
      });
    } else {
      alert('Por favor, preencha o formulário corretamente.');
    }
  }
}