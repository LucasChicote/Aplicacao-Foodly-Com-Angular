import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor';
import { LucideAngularModule, Utensils, ShoppingBag, ShoppingCart, Plus, Trash2, Search, ArrowRight, LogOut, User, CheckCircle } from 'lucide-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    // A forma correta para Standalone é esta:
    importProvidersFrom(
      LucideAngularModule.pick({ 
        Utensils, ShoppingBag, ShoppingCart, Plus, Trash2, Search, ArrowRight, LogOut, User, CheckCircle 
      })
    )
  ]
};