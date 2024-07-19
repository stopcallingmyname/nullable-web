import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  deleteFile,
  FileInfo,
  UploadcareSimpleAuthSchema,
} from '@uploadcare/rest-client';
import { from, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { UpdateUserRequestInterface } from '../types/updateUserRequest.interface';
import { CurrentUserInterface } from 'src/app/shared/types/currentUser.interface';
import { UpdateUserPasswordRequestInterface } from '../types/updateUserPasswordRequest.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  updateUser(
    newProfileData: UpdateUserRequestInterface
  ): Observable<CurrentUserInterface> {
    return this.http.patch<CurrentUserInterface>(
      `${environment.nullableApiUrl}/user`,
      newProfileData
    );
  }

  updateUserPassword(
    newProfileData: UpdateUserPasswordRequestInterface
  ): Observable<CurrentUserInterface> {
    return this.http.patch<CurrentUserInterface>(
      `${environment.nullableApiUrl}/user/password`,
      newProfileData
    );
  }
}
