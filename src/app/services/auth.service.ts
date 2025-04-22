import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:5000'; // Replace with your actual API URL
  private currentUser: User | null = null;

  constructor(private http: HttpClient, private router: Router) {
    this.loadUser();
  }

  private loadUser(): void {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.currentUser = JSON.parse(userData);
    }
  }

  get isLoggedIn(): boolean {
    return !!this.currentUser;
  }

  get user(): User | null {
    return this.currentUser;
  }

  get token(): string | null {
    return localStorage.getItem('token');
  }

  async signUp(email: string, password: string, name?: string): Promise<void> {
    try {
      const response = await fetch(`${this.apiUrl}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password, name })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Sign up failed');
      }

      const data: AuthResponse = await response.json();
      this.handleAuthResponse(data);
    } catch (error) {
      throw error;
    }
  }

  // Updated to include fullName parameter
  async signIn(email: string, password: string, fullName?: string): Promise<void> {
    try {
      const response = await fetch(`${this.apiUrl}/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password, fullName })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Sign in failed');
      }

      const data: AuthResponse = await response.json();
      this.handleAuthResponse(data);
    } catch (error) {
      throw error;
    }
  }

  signOut(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.currentUser = null;
    this.router.navigate(['/signin']);
  }

  private handleAuthResponse(response: AuthResponse): void {
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    this.currentUser = response.user;
  }
}