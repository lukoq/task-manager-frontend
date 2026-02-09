import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);
  const router = inject(Router);

  let authReq = req;

  if(isPlatformBrowser(platformId)) {
    const token = localStorage.getItem('token');
    if(token) {
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 || error.status === 403) {
        console.error('Token has expired');
        
        if (isPlatformBrowser(platformId)) {
          localStorage.removeItem('token'); 
        }
        
        router.navigate(['/login']); 
      }
      return throwError(() => error);
    })
  );
};