import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  Injector,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CreateQueryResult } from '@tanstack/angular-query-experimental';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

import { injectUpdateUserProfileMutation } from 'src/app/account/store/profile/mutations/updateUserProfile.mutation';
import { injectCurrentProfileQuery } from 'src/app/shared/store/profile/queries/currentProfile.query';
import { CurrentProfileInterface } from 'src/app/shared/types/currentProfile.interface';

@Component({
  selector: 'nb-social-profiles',
  standalone: true,
  imports: [ToastModule, ReactiveFormsModule],
  providers: [MessageService],
  templateUrl: './social-profiles.component.html',
  styleUrl: './social-profiles.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SocialProfilesComponent implements OnInit {
  private _injector: Injector = inject(Injector);
  private _updateUserProfileMutation: any;
  formBuilder = inject(FormBuilder);
  currentProfile: CreateQueryResult<CurrentProfileInterface, Error>;
  updateCurrentProfileDataForm: FormGroup;

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    this.initializeValues();
    this.initializeForm();
  }

  initializeValues(): void {
    this.currentProfile = injectCurrentProfileQuery({
      injector: this._injector,
    });
  }

  initializeForm(): void {
    this.updateCurrentProfileDataForm = this.formBuilder.group({
      twitter_url: [this.currentProfile.data()?.twitter_url || null],
      facebook_url: [this.currentProfile.data()?.facebook_url || null],
      instagram_url: [this.currentProfile.data()?.instagram_url || null],
      github_url: [this.currentProfile.data()?.github_url || null],
      behance_url: [this.currentProfile.data()?.behance_url || null],
      linkedIn_url: [this.currentProfile.data()?.linkedIn_url || null],
      vimeo_url: [this.currentProfile.data()?.vimeo_url || null],
    });
  }

  onSubmitUpdateSocialProfile(): void {
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
}
