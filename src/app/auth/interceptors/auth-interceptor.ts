import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectAuthState } from '../store/auth.selectors';
import { take, switchMap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import * as AuthActions from '../store/auth.actions';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(Store);

  return store.select(selectAuthState).pipe(
    take(1),
    switchMap((authState) => {
      const clonedReq = authState.token
        ? req.clone({
          setHeaders: { Authorization: `Bearer ${authState.token}` },
        })
        : req;

      return next(clonedReq).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            store.dispatch(AuthActions.logout());
          }
          return throwError(() => error);
        })
      );
    })
  );
};
