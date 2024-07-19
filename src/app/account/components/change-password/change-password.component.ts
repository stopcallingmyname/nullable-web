import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  Injector,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CreateQueryResult } from '@tanstack/angular-query-experimental';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

import { injectCurrentUserQuery } from 'src/app/shared/store/user/queries/currentUser.query';
import { CurrentUserInterface } from 'src/app/shared/types/currentUser.interface';
import { injectUpdateUserPasswordMutation } from '../../store/user/mutations/updateUserPassword.mutation';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'nb-change-password',
  standalone: true,
  imports: [ToastModule, ReactiveFormsModule],
  providers: [MessageService],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ChangePasswordComponent implements OnInit {
  private _injector: Injector = inject(Injector);
  private _updateUserPasswordMutation: any;
  formBuilder = inject(FormBuilder);
  currentUser: CreateQueryResult<CurrentUserInterface, Error>;
  updateUserPasswordForm: FormGroup;
  isFormSubmitted: boolean = false;

  get formControls() {
    return this.updateUserPasswordForm.controls;
  }

  constructor(private _messageService: MessageService) {}

  ngOnInit(): void {
    this.initializeValues();
    this.initializeForm();
  }

  initializeValues(): void {
    this.currentUser = injectCurrentUserQuery({
      injector: this._injector,
    });
  }

  initializeForm(): void {
    this.updateUserPasswordForm = this.formBuilder.nonNullable.group({
      oldPassword: ['', [Validators.required]],
      newPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(128),
        ],
      ],
    });
  }

  onSubmitUpdateCurrentPassword(): void {
    const isFormValid: boolean = this.updateUserPasswordForm.valid;
    this.isFormSubmitted = true;

    if (!isFormValid) {
      this._messageService.add({
        summary: 'Failed',
        detail: 'Check all fields to be valid.',
      });
      return;
    }

    this._updateUserPasswordMutation = injectUpdateUserPasswordMutation(
      { injector: this._injector },
      { newPasswordData: this.updateUserPasswordForm.value }
    );
    this._updateUserPasswordMutation.mutate(
      { title: 'update-user-password-mutation' },
      {
        onSuccess: () => {
          this.isFormSubmitted = false;
          this.updateUserPasswordForm.reset();

          this._messageService.add({
            summary: 'Success',
            detail: 'Password updated successfully!',
          });
        },
        onError: (response: HttpErrorResponse) => {
          this.isFormSubmitted = false;
          this._messageService.add({
            summary: 'Failed',
            detail: response.error.message,
          });
        },
      }
    );
  }
}
