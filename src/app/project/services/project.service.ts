import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

import { ProjectInterface } from '../types/project.interface';
import { Observable } from 'rxjs';
import { SearchProjectRequestInterface } from '../types/searchProjectsRequest.interface';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  constructor(private http: HttpClient) {}

  search(dto: SearchProjectRequestInterface): Observable<ProjectInterface[]> {
    return this.http.post<ProjectInterface[]>(
      `${environment.nullableApiUrl}/projects/search`,
      dto,
      { withCredentials: true }
    );
  }

  getAllProjects(): Observable<ProjectInterface[]> {
    return this.http.get<ProjectInterface[]>(
      `${environment.nullableApiUrl}/projects/all`,
      { withCredentials: true }
    );
  }

  getUserProjects(username: string): Observable<ProjectInterface[]> {
    return this.http.get<ProjectInterface[]>(
      `${environment.nullableApiUrl}/projects/user/${username}`,
      { withCredentials: true }
    );
  }

  getLikedProjects(username: string): Observable<ProjectInterface[]> {
    return this.http.get<ProjectInterface[]>(
      `${environment.nullableApiUrl}/projects/user/likes/${username}`,
      { withCredentials: true }
    );
  }

  viewProject(pid: string): Observable<ProjectInterface> {
    return this.http.get<ProjectInterface>(
      `${environment.nullableApiUrl}/projects/${pid}`,
      { withCredentials: true }
    );
  }

  create(dto: FormData): Observable<ProjectInterface> {
    return this.http.post<ProjectInterface>(
      `${environment.nullableApiUrl}/projects`,
      dto,
      { withCredentials: true }
    );
  }
}
