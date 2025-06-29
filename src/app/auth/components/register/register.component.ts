import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  Injector,
  NgZone,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { octAlertFill } from '@ng-icons/octicons';
import { TooltipModule } from 'primeng/tooltip';

import { injectRegisterUserMutation } from '../../store/user/mutations/registerUser.mutation';
import { HttpErrorResponse } from '@angular/common/http';
import { SocialAuthService } from '../../services/socialAuth.service';
import { environment } from 'src/environments/environment';

import { CredentialResponse } from 'google-one-tap';
import { injectSocialAuthMutation } from '../../store/user/mutations/socialAuth.mutation';

@Component({
  selector: 'nb-register',
  standalone: true,
  imports: [
    ToastModule,
    RouterLink,
    ReactiveFormsModule,
    NgIconComponent,
    TooltipModule,
  ],
  providers: [MessageService],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  viewProviders: [provideIcons({ octAlertFill })],
})
export class RegisterComponent implements OnInit, AfterViewInit {
  formBuilder: FormBuilder = inject(FormBuilder);
  registrationForm: FormGroup;
  private _injector = inject(Injector);
  private _loginUserMutation: any;
  private _socialAuthMutation: any;
  isFormSubmitted: boolean = false;
  @ViewChild('googleBtnDiv', { read: ElementRef }) elementRef: ElementRef;

  get formControls() {
    return this.registrationForm.controls;
  }

  constructor(
    private _router: Router,
    private _ngZone: NgZone,
    private _messageService: MessageService,
    private _socialAuthService: SocialAuthService
  ) {}

  ngOnInit(): void {
    this.initializeValues();
    this.initializeForm();
  }

  ngAfterViewInit(): void {
    this.initializeGoogle();
  }

  initializeGoogle(): void {
    if (window.google) {
      // @ts-ignore
      google.accounts.id.initialize({
        client_id: environment.googleClientId,
        auto_select: false,
        cancel_on_tap_outside: false,
        context: 'use',
        ux_mode: 'popup',
        itp_support: true,
        use_fedcm_for_prompt: true,
        callback: this.handleCredentialResponse.bind(this),
      });
      // @ts-ignore
      google.accounts.id.prompt();
      // @ts-ignore
      google.accounts.id.renderButton(
        // @ts-ignore
        this.elementRef.nativeElement,
        {
          theme: 'filled_black',
          logo_alignment: 'left',
          shape: 'pill',
          size: 'large',
          locale: 'en_US',
          type: 'icon',
        }
      );
    }
  }

  initializeValues(): void {}

  initializeForm(): void {
    this.registrationForm = this.formBuilder.nonNullable.group({
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
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(128),
        ],
      ],
    });
  }

  handleCredentialResponse(response: CredentialResponse) {
    this._socialAuthMutation = injectSocialAuthMutation(
      {
        injector: this._injector,
      },
      { response: response }
    );

    this._socialAuthMutation.mutate(
      { title: 'social-auth-mutation' },
      {
        onSuccess: () => {
          this._ngZone.run(() => {
            this._router.navigateByUrl('/');
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

  onSubmitRegister(): void {
    const isFormValid: boolean = this.registrationForm.valid;
    this.isFormSubmitted = true;

    if (!isFormValid) {
      this._messageService.add({
        summary: 'Failed',
        detail:
          'Looks like you missed something! Hover over the (⚠️) for more details.',
      });
      return;
    }

    this._loginUserMutation = injectRegisterUserMutation(
      {
        injector: this._injector,
      },
      { user: this.registrationForm.getRawValue() }
    );

    this._loginUserMutation.mutate(
      { title: 'register-user-mutation' },
      {
        onSuccess: () => {
          this.isFormSubmitted = false;
          this._ngZone.run(() => {
            this._router.navigateByUrl('/');
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
