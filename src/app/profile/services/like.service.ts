import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment.development';
import { ProjectInterface } from 'src/app/project/types/project.interface';

@Injectable({
  providedIn: 'root',
})
export class LikeService {
  constructor(private http: HttpClient) {}

  like(projectId: string): Observable<ProjectInterface> {
    return this.http.post<ProjectInterface>(
      `${environment.nullableApiUrl}/likes`,
      { projectId },
      { withCredentials: true }
    );
  }
}
