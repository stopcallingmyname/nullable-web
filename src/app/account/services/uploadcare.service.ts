import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  deleteFile,
  FileInfo,
  UploadcareSimpleAuthSchema,
} from '@uploadcare/rest-client';
import { from, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class UploadcareService {
  uploadcareSimpleAuthSchema: UploadcareSimpleAuthSchema =
    new UploadcareSimpleAuthSchema({
      publicKey: environment.uploadcarePublicKey,
      secretKey: environment.uploadcareSecretKey,
    });

  constructor() {}

  deleteImageFromCdn(imageUrl: string): Observable<FileInfo> {
    return from(
      deleteFile(
        { uuid: this.parseUuidFromUploadcareUrl(imageUrl) },
        { authSchema: this.uploadcareSimpleAuthSchema }
      )
    );
  }

  private parseUuidFromUploadcareUrl(imageUrl: string): string {
    const urlWithoutDomain = imageUrl.replace(
      environment.uploadcareBaseUrl,
      ''
    );
    const uuid = urlWithoutDomain.substring(0, urlWithoutDomain.indexOf('/'));
    return uuid;
  }
}
