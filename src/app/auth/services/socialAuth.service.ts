import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

import { CredentialResponse } from 'google-one-tap';

@Injectable({
  providedIn: 'root',
})
export class SocialAuthService {
  constructor(private http: HttpClient) {}

  authorizeWithGoogle(response: CredentialResponse): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post<CredentialResponse>(
      `${environment.nullableApiUrl}/auth/google-login`,
      response,
      { headers: headers, withCredentials: true }
    );
  }
}
