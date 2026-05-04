import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectIsLoggedIn } from '../store/auth.selectors';
import { map, tap } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(selectIsLoggedIn).pipe(
    map((loggedIn) => {
      if (!loggedIn) {
        router.navigate(['/login']);
        return false;
      }
      return true;
    })
  );
};
