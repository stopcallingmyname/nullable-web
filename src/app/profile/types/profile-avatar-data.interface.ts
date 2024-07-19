export interface CurrentProfileAvatarDataInterface {
  cdnUrl: string;
  cdnUrlModifiers: string;
  errors: any[];
  externalUrl: string | null;
  file: File;
  fileInfo: {
    uuid: string;
    name: string;
    size: number;
    isStored: boolean;
    isImage: boolean;
  };
  fullPath: string | null;
  internalId: string;
  isFailed: boolean;
  isImage: boolean;
  isRemoved: boolean;
  isSuccess: boolean;
  isUploading: boolean;
  metadata: any;
  mimeType: string;
  name: string;
  size: number;
  status: string;
  uploadProgress: number;
  uuid: string;
}
