import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  inject,
  Injector,
  NgZone,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { CreateQueryResult } from '@tanstack/angular-query-experimental';
import { MessageService } from 'primeng/api';
import { ChipModule } from 'primeng/chip';
import { ChipsModule } from 'primeng/chips';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { octHeartFill } from '@ng-icons/octicons';
import { ionEye } from '@ng-icons/ionicons';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputNumberModule } from 'primeng/inputnumber';

import { ProjectService } from 'src/app/project/services/project.service';
import { FileUploadComponent } from 'src/app/shared/components/file-upload/file-upload.component';
import { injectCurrentProfileQuery } from 'src/app/shared/store/profile/queries/currentProfile.query';
import { injectCurrentUserQuery } from 'src/app/shared/store/user/queries/currentUser.query';
import { CurrentProfileInterface } from 'src/app/shared/types/currentProfile.interface';
import { CurrentUserInterface } from 'src/app/shared/types/currentUser.interface';
import { ProjectInterface } from 'src/app/project/types/project.interface';

@Component({
  selector: 'nb-new-project',
  standalone: true,
  imports: [
    RouterLink,
    FileUploadComponent,
    ToastModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputNumberModule,
    ReactiveFormsModule,
    NgIconComponent,
    DialogModule,
    ChipsModule,
    ChipModule,
  ],
  providers: [MessageService],
  templateUrl: './new-project.component.html',
  styleUrl: './new-project.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  viewProviders: [provideIcons({ octHeartFill, ionEye })],
})
export class NewProjectComponent implements OnInit {
  userProfile: CreateQueryResult<CurrentProfileInterface, Error>;
  currentUser: CreateQueryResult<CurrentUserInterface, Error>;
  private _injector = inject(Injector);
  formBuilder = inject(FormBuilder);
  projectForm: FormGroup;
  isFormSubmitted: boolean = false;
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  isFinalTouchesVisible: boolean;

  constructor(
    private _messageService: MessageService,
    private _projectService: ProjectService,
    private _ngZone: NgZone,
    private _router: Router
  ) {}

  ngOnInit() {
    this.initializeValues();
    this.initializeForm();
  }

  initializeValues() {
    this.currentUser = injectCurrentUserQuery({ injector: this._injector });
    this.userProfile = injectCurrentProfileQuery({ injector: this._injector });
    this.isFinalTouchesVisible = false;
  }

  initializeForm(): void {
    this.projectForm = this.formBuilder.group({
      preview_img: [null, Validators.required],
      title: ['', Validators.required],
      description: [''],
      components: [[]],
      timeSpent: [null],
      tags: new FormControl<string[] | null>(null),
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.projectForm.patchValue({ preview_img: file });

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmitCreateProject() {
    const isFormValid: boolean = this.projectForm.valid;
    this.isFormSubmitted = true;

    if (!isFormValid || !this.selectedFile) {
      // this._messageService.add({
      //   summary: 'Failed',
      //   detail: 'Check all fields to be valid.',
      // });
      return;
    }
    const formData = new FormData();
    for (let key in this.projectForm.value) {
      if (Array.isArray(this.projectForm.value[key])) {
        this.projectForm.value[key].forEach((value: string) => {
          formData.append(`${key}[]`, value);
        });
      } else {
        formData.append(key, this.projectForm.value[key]);
      }
    }

    this._projectService.create(formData).subscribe({
      next: (response: ProjectInterface) => {
        this._ngZone.run(() => {
          this._router.navigate(['/shots', response.id]);
        });
      },
      error: () => {
        console.log('error');
      },
    });
  }

  toggleFinalTouchesDialog() {
    this.isFinalTouchesVisible = !this.isFinalTouchesVisible;
  }
}
