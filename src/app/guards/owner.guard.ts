import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ApiService } from '../service/api.service';

export const ownerGuard: CanActivateFn = () => {
  const service = inject(ApiService);
  const router  = inject(Router);
  if (service.isOwner()) return true;
  return router.createUrlTree(['/home']);
};