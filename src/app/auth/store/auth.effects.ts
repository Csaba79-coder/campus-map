import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '../services/auth';
import * as AuthActions from './auth.actions';
import { catchError, map, mergeMap, tap, of } from 'rxjs';
import { Router } from '@angular/router';

export const loginEffect = createEffect(
  (
    actions$ = inject(Actions),
    authService = inject(AuthService),
    router = inject(Router)
  ) =>
    actions$.pipe(
      ofType(AuthActions.login),
      mergeMap(({ username, password }) =>
        authService.login(username, password).pipe(
          map((response) =>
            AuthActions.loginSuccess({
              username: response.username,
              token: response.token,
              userId: response.userId,
            })
          ),
          catchError((error) =>
            of(AuthActions.loginFailure({ error: error.error?.error || 'Invalid username or password' }))
          )
        )
      )
    ),
  { functional: true }
);

export const loginSuccessEffect = createEffect(
  (actions$ = inject(Actions), router = inject(Router)) =>
    actions$.pipe(
      ofType(AuthActions.loginSuccess),
      tap(({ username, token, userId }) => {
        localStorage.setItem('auth', JSON.stringify({ username, token, userId }));
        router.navigate(['/']);
      })
    ),
  { functional: true, dispatch: false }
);

export const logoutEffect = createEffect(
  (actions$ = inject(Actions), router = inject(Router)) =>
    actions$.pipe(
      ofType(AuthActions.logout),
      tap(() => {
        localStorage.removeItem('auth');
        router.navigate(['/login']);
      })
    ),
  { functional: true, dispatch: false }
);
