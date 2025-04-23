import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface SignUpData {
  fullName: string;
  email: string;
  password: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:5000';
  private tokenKey = 'auth_token';
  isAuthenticated = false;

  constructor(private http: HttpClient) { 
    this.checkAuthStatus();
  }

  private checkAuthStatus(): void {
    this.isAuthenticated = !!this.getToken();
  }

  signUp(userData: SignUpData, successCallback: () => void, errorCallback: (error: any) => void): void {
    this.http.post(`${this.apiUrl}/signup`, userData).subscribe({
      next: () => successCallback(),
      error: (error) => errorCallback(error)
    });
  }

  signIn(credentials: SignInData, successCallback: () => void, errorCallback: (error: any) => void): void {
    this.http.post<AuthResponse>(`${this.apiUrl}/signin`, credentials).subscribe({
      next: (response) => {
        this.setToken(response.accessToken);
        this.isAuthenticated = true;
        successCallback();
      },
      error: (error) => errorCallback(error)
    });
  }

  signOut(): void {
    localStorage.removeItem(this.tokenKey);
    this.isAuthenticated = false;
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }
}