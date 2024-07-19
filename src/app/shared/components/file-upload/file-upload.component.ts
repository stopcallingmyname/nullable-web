import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { SidebarModule } from 'primeng/sidebar';

import { FileUploadService } from '../../services/file-upload.service';

@Component({
  selector: 'nb-file-upload',
  standalone: true,
  imports: [ToastModule, SidebarModule],
  providers: [MessageService],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss',
})
export class FileUploadComponent implements OnInit {
  imageUrl: string | undefined;
  fileId: string | undefined;
  isSidebarVisible: boolean;

  constructor(
    private _fileUploadService: FileUploadService,
    private _messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.initializeValues();
  }

  initializeValues(): void {
    this.isSidebarVisible = false;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      this._fileUploadService.uploadFile(formData).subscribe({
        next: (response) => {
          console.log('Upload successful:', response);
          this.imageUrl = response.cdnUrl;
          this.fileId = response.fileId;
        },
        error: (response: HttpErrorResponse) => {
          this._messageService.add({
            summary: 'Failed',
            detail: response.error.message,
          });
        },
      });
    }
  }

  onDeleteFile() {
    if (this.fileId) {
      this._fileUploadService.deleteFile(this.fileId).subscribe({
        next: () => {
          this.imageUrl = undefined;
          this.fileId = undefined;
          this.isSidebarVisible = false;
        },
        error: (response: HttpErrorResponse) => {
          this._messageService.add({
            summary: 'Failed',
            detail: response.error.message,
          });
          this.isSidebarVisible = false;
        },
      });
    }
  }
}
