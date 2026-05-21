import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [RouterLink, LucideAngularModule],
  templateUrl: './welcome.html'
})
export class WelcomeComponent {}
