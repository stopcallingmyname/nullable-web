import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { CurrentUserInterface } from '../../shared/types/currentUser.interface';
import { RegisterRequestInterface } from '../types/registerRequest.interface';
import { LoginRequestInterface } from '../types/loginRequest.interface';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  register(data: RegisterRequestInterface): Observable<void> {
    return this.http.post<void>(
      `${environment.nullableApiUrl}/auth/register`,
      data,
      { withCredentials: true }
    );
  }

  login(user: LoginRequestInterface): Observable<void> {
    console.log(environment.uploadcareSecretKey);
    console.log(environment.nullableApiUrl);
    return this.http.post<void>(
      `${environment.nullableApiUrl}/auth/login`,
      user,
      { withCredentials: true }
    );
  }

  isAuthorized(): Observable<boolean> {
    return this.getUser().pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  logout(): Observable<void> {
    return this.http.get<void>(`${environment.nullableApiUrl}/auth/logout`, {
      withCredentials: true,
    });
  }

  refresh(): Observable<void> {
    return this.http.get<void>(`${environment.nullableApiUrl}/auth/refresh`, {
      withCredentials: true,
    });
  }

  getUser(): Observable<CurrentUserInterface> {
    return this.http.get<CurrentUserInterface>(
      `${environment.nullableApiUrl}/auth/user`,
      { withCredentials: true }
    );
  }
}
