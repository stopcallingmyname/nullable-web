import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  inject,
  Injector,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import * as LR from '@uploadcare/blocks';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { CurrentProfileAvatarDataInterface } from 'src/app/profile/types/profile-avatar-data.interface';
import { CreateQueryResult } from '@tanstack/angular-query-experimental';
import { CurrentProfileInterface } from 'src/app/shared/types/currentProfile.interface';
import { injectCurrentProfileQuery } from 'src/app/shared/store/profile/queries/currentProfile.query';
import { injectUpdateUserProfileMutation } from '../../store/profile/mutations/updateUserProfile.mutation';
import { TextareaComponent } from 'src/app/shared/components/textarea/textarea.component';
import { UploadcareService } from '../../services/uploadcare.service';
import { injectUpdateProfileAvatarMutation } from '../../store/profile/mutations/updateProfileAvatar.mutation';
import { injectDeleteProfileAvatarMutation } from '../../store/profile/mutations/deleteProfileAvatar.mutation';

LR.registerBlocks(LR);
LR.FileUploaderRegular.shadowStyles =
  ':host lr-simple-btn button { font-family: "LotaGrotesque", serif; width: fit-content; height: 100%;  --tw-ring-opacity: 1; --tw-ring-color: rgb(209 213 219 / var(--tw-ring-opacity)); font-weight: 600;  border-radius: 9999px; font-size: 0.875rem; line-height: 1.25rem; padding-left: 1.25rem !important; padding-right: 1.25rem !important;  padding-top: 0.625rem !important; padding-bottom: 0.625rem !important; margin: 0; transition-property: all; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 200ms;  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color);  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000); background-color: transparent !important;  --tw-text-opacity: 1; color: rgb(13 12 34 / var(--tw-text-opacity)); } lr-simple-btn button:hover{background-color: transparent !important;  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color);  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000); --tw-ring-opacity: 1; --tw-ring-color: rgb(156 163 175 / var(--tw-ring-opacity)); } lr-simple-btn span {display: none;} lr-simple-btn button:after {content: "Upload new picture";} lr-simple-btn lr-icon {display: none;}';

@Component({
  selector: 'nb-edit-profile',
  standalone: true,
  imports: [ToastModule, ReactiveFormsModule, TextareaComponent],
  providers: [MessageService],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class EditProfileComponent implements OnInit, OnDestroy {
  @ViewChild('ctxProvider', { static: true }) ctxProviderRef!: ElementRef<
    InstanceType<LR.UploadCtxProvider>
  >;
  private _injector: Injector = inject(Injector);
  private _newProfileAvatarData: CurrentProfileAvatarDataInterface[];
  private _updateUserProfileMutation: any;
  private _updateProfileAvatarMutation: any;
  private _deleteProfileAvatarMutation: any;
  formBuilder = inject(FormBuilder);
  currentProfile: CreateQueryResult<CurrentProfileInterface, Error>;
  updateCurrentProfileDataForm: FormGroup;

  constructor(
    private messageService: MessageService,
    private uploadcareService: UploadcareService
  ) {}

  ngOnInit(): void {
    this.initializeValues();
    this.initializeForm();
    this.initializeEventListeners();
  }

  ngOnDestroy(): void {
    this.removeEventListeners();
  }

  initializeValues(): void {
    this.currentProfile = injectCurrentProfileQuery({
      injector: this._injector,
    });
  }

  initializeForm(): void {
    this.updateCurrentProfileDataForm = this.formBuilder.group({
      full_name: [this.currentProfile.data()?.full_name || null],
      location: [this.currentProfile.data()?.location || null],
      bio: [this.currentProfile.data()?.bio || null],
      personal_website_url: [
        this.currentProfile.data()?.personal_website_url || null,
      ],
    });
  }

  initializeEventListeners(): void {
    this.ctxProviderRef.nativeElement.addEventListener(
      'common-upload-success',
      this.handleCommonUploadSuccessEvent
    );
    this.ctxProviderRef.nativeElement.addEventListener(
      'done-click',
      this.handleDoneClickEvent
    );
    this.ctxProviderRef.nativeElement.addEventListener(
      'file-removed',
      this.handleFileRemovedEvent
    );
  }

  removeEventListeners(): void {
    this.ctxProviderRef.nativeElement.removeEventListener(
      'common-upload-success',
      this.handleCommonUploadSuccessEvent
    );
    this.ctxProviderRef.nativeElement.removeEventListener(
      'done-click',
      this.handleDoneClickEvent
    );
    this.ctxProviderRef.nativeElement.removeEventListener(
      'file-removed',
      this.handleFileRemovedEvent
    );
  }

  onSubmitUpdateCurrentProfile(): void {
    this._updateUserProfileMutation = injectUpdateUserProfileMutation(
      { injector: this._injector },
      { newProfileData: this.updateCurrentProfileDataForm.getRawValue() }
    );

    this._updateUserProfileMutation.mutate(
      { title: 'update-user-profile-mutation' },
      {
        onSuccess: () => {
          this.messageService.add({
            summary: 'Success',
            detail: 'Profile updated successfully!',
          });
        },
        onError: () => {
          this.messageService.add({
            summary: 'Failed',
            detail: 'Failed to update profile.',
          });
        },
      }
    );
  }

  handleDoneClickEvent = (e: CustomEvent<LR.OutputCollectionState>) => {
    this._updateProfileAvatarMutation = injectUpdateProfileAvatarMutation(
      { injector: this._injector },
      { image_uuid: this._newProfileAvatarData[0].uuid }
    );

    this._updateProfileAvatarMutation.mutate(
      { title: 'update-profile-avatar-mutation' },
      {
        onSuccess: () => {
          this.messageService.add({
            summary: 'Success',
            detail: 'Picture updated successfully'!,
          });
        },
        onError: () => {
          this.messageService.add({
            summary: 'Failed',
            detail: 'Failed to upload picture.',
          });
        },
      }
    );
  };

  handleCommonUploadSuccessEvent = (e: LR.EventMap['change']) => {
    this._newProfileAvatarData = e.detail.allEntries.filter(
      (f) => f.status === 'success'
    ) as CurrentProfileAvatarDataInterface[];
  };

  handleFileRemovedEvent = (e: CustomEvent<LR.OutputFileEntry>) => {
    if (e.detail.isRemoved) {
      this.uploadcareService.deleteImageFromCdn(
        this._newProfileAvatarData[0].cdnUrl
      );
    }
  };

  resetUploaderState(): void {
    this.ctxProviderRef.nativeElement.uploadCollection.clearAll();
  }

  deleteProfileAvatar(): void {
    this._deleteProfileAvatarMutation = injectDeleteProfileAvatarMutation({
      injector: this._injector,
    });

    this._deleteProfileAvatarMutation.mutate(
      { title: 'update-profile-avatar-mutation' },
      {
        onSuccess: () => {
          this.messageService.add({
            summary: 'Success',
            detail: 'Picture successfully deleted!',
          });
        },
        onError: () => {
          this.messageService.add({
            summary: 'Failed',
            detail: 'Failed to delete picture.',
          });
        },
      }
    );
  }
}
