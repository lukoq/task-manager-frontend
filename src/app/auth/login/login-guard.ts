import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

export const loginGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if(isPlatformBrowser(platformId)) {
    const token = localStorage.getItem('token');

    if(token) {
      router.navigate(['/tasks']);
      return false;
    }
  }

  return true;
};