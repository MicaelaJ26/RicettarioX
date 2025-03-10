import { HttpInterceptorFn } from '@angular/common/http';
import { HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { catchError, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { inject } from '@angular/core'; 
import { AuthService } from '../services/auth.service';  

export const JwtInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const token = localStorage.getItem('access_token');  

  if (token && !req.url.includes('/api/register/')) {
    const clonedReq = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
    return next(clonedReq);
  }
  return next(req);
};

function handle401Error(error: any, next: HttpHandlerFn, req: HttpRequest<any>, authService: AuthService): Observable<any> {
  return authService.refreshToken().pipe(
    switchMap((newToken) => {
      if (newToken) {
        req = req.clone({ setHeaders: { Authorization: `Bearer ${newToken}` } });
        return next(req);
      } else {
        authService.logout();
        return next(req);
      }
    }),
    catchError((refreshError) => {
      authService.logout();
      return next(req);
    })
  );
}
