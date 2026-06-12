import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';


export const roleGuard: CanActivateFn = (route,state) => {

  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }
   const permissions = auth.getPermissions();
  const currentRoute = state.url.split('?')[0];

const hasPermission = permissions.some(
  permission => currentRoute.startsWith(permission)
);
  

if (hasPermission) {
    return true;
  }

  
  router.navigate(['/unauthorized']);
  return false;
};