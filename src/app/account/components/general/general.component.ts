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
import { injectUpdateUserMutation } from '../../store/user/mutations/updateUser.mutation';

@Component({
  selector: 'nb-general',
  standalone: true,
  imports: [ToastModule, ReactiveFormsModule],
  providers: [MessageService],
  templateUrl: './general.component.html',
  styleUrl: './general.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class GeneralComponent implements OnInit {
  private injector: Injector = inject(Injector);
  private updateUserMutation: any;
  formBuilder = inject(FormBuilder);
  currentUser: CreateQueryResult<CurrentUserInterface, Error>;
  updateUserDataForm: FormGroup;
  isFormSubmitted: boolean = false;

  get formControls() {
    return this.updateUserDataForm.controls;
  }

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    this.initializeValues();
    this.initializeForm();
  }

  initializeValues(): void {
    this.currentUser = injectCurrentUserQuery({
      injector: this.injector,
    });
  }

  initializeForm(): void {
    this.updateUserDataForm = this.formBuilder.nonNullable.group({
      username: [
        '',
        [
          Validators.required,
          Validators.pattern('^[A-Za-z0-9_-]*$'),
          Validators.minLength(2),
          Validators.maxLength(30),
        ],
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ],
      ],
    });
  }

  onSubmitUpdateCurrentUser(): void {
    const isFormValid: boolean = this.updateUserDataForm.valid;
    this.isFormSubmitted = true;

    if (!isFormValid) {
      this.messageService.add({
        summary: 'Failed',
        detail: 'Check all fields to be valid.',
      });
      return;
    }

    this.updateUserMutation = injectUpdateUserMutation(
      { injector: this.injector },
      { newUserData: this.updateUserDataForm.value }
    );
    this.updateUserMutation.mutate(
      { title: 'update-user-mutation' },
      {
        onSuccess: () => {
          this.messageService.add({
            summary: 'Success',
            detail: 'Your data updated successfully!',
          });
        },
        onError: () => {
          this.messageService.add({
            summary: 'Failed',
            detail: 'Failed to update user data.',
          });
        },
      }
    );
  }
}
