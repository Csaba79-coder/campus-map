import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';

export interface AuthState {
  username: string | null;
  token: string | null;
  error: string | null;
  loading: boolean;
}

const savedUser = localStorage.getItem('auth');
const parsedUser = savedUser ? JSON.parse(savedUser) : null;

export const initialState: AuthState = {
  username: parsedUser?.username ?? null,
  token: parsedUser?.token ?? null,
  error: null,
  loading: false,
};

export const authReducer = createReducer(
  initialState,
  on(AuthActions.login, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(AuthActions.loginSuccess, (state, { username, token }) => ({
    ...state,
    username,
    token,
    loading: false,
    error: null,
  })),
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(AuthActions.logout, () => ({
    username: null,
    token: null,
    error: null,
    loading: false,
  }))
);
