import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';


export const roleGuard: CanActivateFn = (route) => {

  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  const expectedRole = route.data['role'];
  const userRole = auth.getRoleFromToken();
console.log('Expected Role:', expectedRole);
console.log('User Role:', userRole);
  if (!expectedRole || !userRole) {
    router.navigate(['/unauthorized']);
    return false;
  }

  // normalize roles
  const normalizedUserRole = userRole.toLowerCase();
  const normalizedExpectedRole = expectedRole.toLowerCase();

  if (normalizedUserRole === normalizedExpectedRole) {
    return true;
  }

  router.navigate(['/unauthorized']);
  return false;
};