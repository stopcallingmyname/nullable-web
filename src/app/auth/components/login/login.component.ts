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
import { Router, RouterLink, withDebugTracing } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { octAlertFill } from '@ng-icons/octicons';
import { TooltipModule } from 'primeng/tooltip';

import { injectLoginUserMutation } from 'src/app/auth/store/user/mutations/loginUser.mutation';
import { HttpErrorResponse } from '@angular/common/http';
import { CredentialResponse } from 'google-one-tap';
import { SocialAuthService } from '../../services/socialAuth.service';
import { environment } from 'src/environments/environment';

import { injectSocialAuthMutation } from '../../store/user/mutations/socialAuth.mutation';

@Component({
  selector: 'nb-login',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    NgIconComponent,
    TooltipModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  viewProviders: [provideIcons({ octAlertFill })],
})
export class LoginComponent implements OnInit, AfterViewInit {
  formBuilder = inject(FormBuilder);
  loginForm: FormGroup;
  private _injector = inject(Injector);
  private _loginUserMutation: any;
  private _socialAuthMutation: any;
  isFormSubmitted: boolean = false;
  @ViewChild('googleBtnDiv', { read: ElementRef }) elementRef: ElementRef;

  get formControls() {
    return this.loginForm.controls;
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
    this.loginForm = this.formBuilder.nonNullable.group({
      identifier: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  // async handleCredentialResponse(response: CredentialResponse) {
  //   await this._socialAuthService.authorizeWithGoogle(response).subscribe({
  //     next: () => {
  //       this._ngZone.run(() => {
  //         this._router.navigateByUrl('/');
  //       });
  //     },
  //     error: (error: HttpErrorResponse) => {
  //       console.log(error);
  //     },
  //   });
  // }

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

  onSubmitLogin(): void {
    const isFormValid: boolean = this.loginForm.valid;
    this.isFormSubmitted = true;

    if (!isFormValid) {
      this._messageService.add({
        summary: 'Failed',
        detail:
          'Looks like you missed something! Hover over the (⚠️) for more details.',
      });
      return;
    }

    this._loginUserMutation = injectLoginUserMutation(
      {
        injector: this._injector,
      },
      { user: this.loginForm.getRawValue() }
    );

    this._loginUserMutation.mutate(
      { title: 'login-user-mutation' },
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
