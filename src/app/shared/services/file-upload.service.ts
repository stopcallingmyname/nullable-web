import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  constructor(private http: HttpClient) {}

  uploadFile(file: FormData) {
    return this.http.post<{ cdnUrl: string; fileId: string }>(
      `${environment.nullableApiUrl}/upload`,
      file,
      { withCredentials: true }
    );
  }

  deleteFile(fileId: string) {
    return this.http.delete(`${environment.nullableApiUrl}/upload/${fileId}`, {
      withCredentials: true,
    });
  }
}
