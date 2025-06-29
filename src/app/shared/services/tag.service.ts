import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TagInterface } from '../types/tag.interface';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TagService {
  constructor(private http: HttpClient) {}

  getAllTags(): Observable<TagInterface[]> {
    return this.http.get<TagInterface[]>(
      `${environment.nullableApiUrl}/tags/all`,
      { withCredentials: true }
    );
  }
}
