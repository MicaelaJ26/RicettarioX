
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const ErrorInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  return next(req).pipe(
    catchError(error => {
      console.error('HTTP Error:', error);
      
      return throwError(() => error);
    })
  );
};
