import { Component, inject, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service';
import { HeaderComponent } from '../components/header/header';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, CommonModule, FormsModule],
  template: `<app-header />`
})
export class HomeComponent implements OnInit {
  service = inject(ApiService);
  router  = inject(Router);

  ngOnInit() {
    this.router.navigate(['/restaurantes']);
  }
}
