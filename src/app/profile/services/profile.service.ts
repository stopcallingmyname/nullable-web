import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { UpdateProfileRequestInterface } from 'src/app/account/types/updateProfileRequestInterface';

import { CurrentProfileInterface } from 'src/app/shared/types/currentProfile.interface';
import { environment } from 'src/environments/environment.development';
import { UpdateUserSkillsRequestInterface } from '../types/update-user-skills-request.interface..dto';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(private http: HttpClient) {}

  getAllProfiles(): Observable<CurrentProfileInterface[]> {
    return this.http.get<CurrentProfileInterface[]>(
      `${environment.nullableApiUrl}/profile/all`,
      { withCredentials: true }
    );
  }

  getProfileByUid(uid: string): Observable<CurrentProfileInterface> {
    return this.http.get<CurrentProfileInterface>(
      `${environment.nullableApiUrl}/profile/id=${uid}`,
      { withCredentials: true }
    );
  }

  getProfileByUsername(username: string): Observable<CurrentProfileInterface> {
    return this.http.get<CurrentProfileInterface>(
      `${environment.nullableApiUrl}/profile/${username}`,
      { withCredentials: true }
    );
  }

  getCurrentProfile(): Observable<CurrentProfileInterface> {
    return this.http.get<CurrentProfileInterface>(
      `${environment.nullableApiUrl}/profile`,
      { withCredentials: true }
    );
  }

  deleteCurrentProfile() {
    return this.http.delete(`${environment.nullableApiUrl}/profile`, {
      withCredentials: true,
    });
  }

  uploadProfileAvatar(
    avatar_uuid: string
  ): Observable<CurrentProfileInterface> {
    return this.http.patch<CurrentProfileInterface>(
      `${environment.nullableApiUrl}/profile/upload-avatar`,
      {
        avatarUrl: `${environment.uploadcareBaseUrl}${avatar_uuid}/`,
      },
      { withCredentials: true }
    );
  }

  deleteProfileAvatar(): Observable<CurrentProfileInterface> {
    return this.http.delete<CurrentProfileInterface>(
      `${environment.nullableApiUrl}/profile/delete-avatar`,
      { withCredentials: true }
    );
  }

  updateProfile(
    newProfileData: UpdateProfileRequestInterface
  ): Observable<CurrentProfileInterface> {
    return this.http.patch<CurrentProfileInterface>(
      `${environment.nullableApiUrl}/profile`,
      newProfileData,
      { withCredentials: true }
    );
  }

  updateSkills(
    newSkills: UpdateUserSkillsRequestInterface
  ): Observable<CurrentProfileInterface> {
    return this.http.patch<CurrentProfileInterface>(
      `${environment.nullableApiUrl}/profile/skills`,
      newSkills,
      { withCredentials: true }
    );
  }

  deleteSkill(skillId: string): Observable<CurrentProfileInterface> {
    return this.http.delete<CurrentProfileInterface>(
      `${environment.nullableApiUrl}/profile/skills/${skillId}`,
      { withCredentials: true }
    );
  }
}
