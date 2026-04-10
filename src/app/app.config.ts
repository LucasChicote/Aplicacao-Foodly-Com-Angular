import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor';
import {
  LucideAngularModule,
  
  ArrowLeft, ArrowRight, ChevronRight, LogIn, LogOut, Menu,
  
  User, UserCircle, UserPlus, Shield, ShieldCheck, Lock, Mail, Eye, EyeOff,
  
  Leaf, Utensils, Store, ShoppingBag, ShoppingCart, Package, PackageCheck,
  
  Plus, PlusCircle, Trash2, RefreshCw, X, XCircle, CheckCircle, CheckCircle2,
  
  Clock, Flame, Bike, AlertCircle, Info, Search, Tag, Loader,
  
  LayoutDashboard, ClipboardList, Inbox, Users, MapPin
} from 'lucide-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([authInterceptor])),
    importProvidersFrom(
      LucideAngularModule.pick({
        ArrowLeft, ArrowRight, ChevronRight, LogIn, LogOut, Menu,
        User, UserCircle, UserPlus, Shield, ShieldCheck, Lock, Mail, Eye, EyeOff,
        Leaf, Utensils, Store, ShoppingBag, ShoppingCart, Package, PackageCheck,
        Plus, PlusCircle, Trash2, RefreshCw, X, XCircle, CheckCircle, CheckCircle2,
        Clock, Flame, Bike, AlertCircle, Info, Search, Tag, Loader,
        LayoutDashboard, ClipboardList, Inbox, Users, MapPin
      })
    )
  ]
};