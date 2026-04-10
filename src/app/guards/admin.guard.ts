import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ApiService } from '../service/api.service';

export const adminGuard: CanActivateFn = () => {
  const service = inject(ApiService);
  const router  = inject(Router);
  if (service.isAdmin()) return true;
  return router.createUrlTree(['/home']);
};