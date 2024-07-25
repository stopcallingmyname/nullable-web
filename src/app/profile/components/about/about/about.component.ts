import { CommonModule, DatePipe } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  Injector,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  octLocation,
  octPerson,
  octFeedPerson,
  octHeartFill,
} from '@ng-icons/octicons';
import {
  bootstrapInstagram,
  bootstrapBehance,
  bootstrapTwitter,
  bootstrapGithub,
  bootstrapVimeo,
  bootstrapLinkedin,
  bootstrapFacebook,
} from '@ng-icons/bootstrap-icons';
import { CreateQueryResult } from '@tanstack/angular-query-experimental';
import { DialogModule } from 'primeng/dialog';
import { ChipsModule } from 'primeng/chips';
import { ChipModule } from 'primeng/chip';
import { FieldsetModule } from 'primeng/fieldset';
import { AccordionModule } from 'primeng/accordion';
import { InputSwitchModule } from 'primeng/inputswitch';
import { KnobModule } from 'primeng/knob';
import { ChartModule } from 'primeng/chart';
import { ProjectCountsInterface } from 'src/app/profile/types/projectCounts.interface';

import { CurrentProfileInterface } from 'src/app/shared/types/currentProfile.interface';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { injectUpdateUserSkillsMutation } from 'src/app/profile/store/profile/mutations/updateUserSkills.mutation';
import { TagInterface } from 'src/app/shared/types/tag.interface';
import { MessageService } from 'primeng/api';
import { injectDeleteUserSkillMutation } from 'src/app/profile/store/profile/mutations/deleteUserSkill.mutation';
import { ToastModule } from 'primeng/toast';
import { injectUserProfileByUsernameQuery } from 'src/app/shared/store/profile/queries/userProfileByUsername.query';
import { ionTimeOutline } from '@ng-icons/ionicons';
import { injectUpdateUserProfileMutation } from 'src/app/account/store/profile/mutations/updateUserProfile.mutation';
import { addDays, formatDate, startOfWeek, subDays } from 'date-fns';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'nb-about',
  standalone: true,
  imports: [
    ToastModule,
    RouterLink,
    NgIconComponent,
    FieldsetModule,
    DatePipe,
    DialogModule,
    ChipsModule,
    InputSwitchModule,
    KnobModule,
    ReactiveFormsModule,
    AccordionModule,
    ChipModule,
    FormsModule,
    TooltipModule,
    CommonModule,
    ChartModule,
  ],
  providers: [MessageService],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
  viewProviders: [
    provideIcons({
      octLocation,
      octPerson,
      octFeedPerson,
      bootstrapInstagram,
      bootstrapBehance,
      bootstrapTwitter,
      bootstrapGithub,
      bootstrapVimeo,
      bootstrapLinkedin,
      bootstrapFacebook,
      ionTimeOutline,
      octHeartFill,
    }),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AboutComponent implements OnInit {
  userProfile: CreateQueryResult<CurrentProfileInterface, Error>;
  private _injector = inject(Injector);
  isSkillsDialogVisible: boolean;
  formBuilder = inject(FormBuilder);
  skillsForm: FormGroup;
  updateCurrentProfileDataForm: FormGroup;
  private _updateUserSkillsMutation: any;
  private _deleteUserSkillMutation: any;
  private _updateUserProfileMutation: any;
  isAvailableForWork: boolean;
  knobProjects: string;
  weeklyChartData: any;
  weeklyChartOptions: any;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.initializeValues();
    this.initializeForm();
    this.updateDisplayValue();
    this.processWeeklyProjectData();
  }

  updateDisplayValue() {
    const projectsCount = this.userProfile.data()!.projects_count;
    const likesCount = this.userProfile.data()!.likes_count;
    this.knobProjects = projectsCount > 30 ? '30+' : projectsCount.toString();
  }

  initializeValues(): void {
    this._activatedRoute.parent?.paramMap.subscribe((params) => {
      const username: string | null = params.get('username');
      if (username) {
        this.userProfile = injectUserProfileByUsernameQuery(
          { username: username },
          { injector: this._injector }
        );

        this.isAvailableForWork =
          this.userProfile.data()?.open_to_work || false;
      }

      this.isSkillsDialogVisible = false;
    });
  }

  initializeForm(): void {
    this.updateCurrentProfileDataForm = this.formBuilder.group({
      open_to_work: [this.userProfile.data()?.open_to_work || false],
    });

    this.skillsForm = this.formBuilder.group({
      skills: new FormControl<string[] | null>(null),
    });
  }

  toggleSkillsDialog() {
    this.skillsForm.reset();
    this.isSkillsDialogVisible = !this.isSkillsDialogVisible;
  }

  onSubmit() {
    this.onSubmitUpdateCurrentProfile();
    this.onSubmitUpdateUserSkills();
  }

  onSubmitUpdateUserSkills(): void {
    const skillsValue = this.skillsForm.get('skills')?.value;
    if (!skillsValue || skillsValue.length === 0) {
      console.log('Skills form is empty or null');
      return;
    }

    this._updateUserSkillsMutation = injectUpdateUserSkillsMutation(
      { injector: this._injector },
      { newSkills: this.skillsForm.getRawValue() }
    );
    this._updateUserSkillsMutation.mutate(
      { title: 'update-user-skills-mutation' },
      {
        onSuccess: () => {
          this.toggleSkillsDialog();
          this.messageService.add({
            summary: 'Success',
            detail: 'Changes saved!',
          });
        },
        onError: () => {
          this.messageService.add({
            summary: 'Failed',
            detail: 'Failed to save changes.',
          });
        },
      }
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

  onRemoveUserSkill(event: MouseEvent, skill: TagInterface) {
    this._deleteUserSkillMutation = injectDeleteUserSkillMutation(
      { injector: this._injector },
      { skillId: skill.id }
    );
    this._deleteUserSkillMutation.mutate(
      { title: 'delete-user-skills-mutation' },
      {
        onSuccess: (data: CurrentProfileInterface) => {
          this.messageService.add({
            summary: 'Success',
            detail: `${skill.tag_name} - was successfully removed.`,
          });
        },
        onError: () => {
          this.messageService.add({
            summary: 'Failed',
            detail: `Failed to remove ${skill.tag_name}.`,
          });
        },
      }
    );
  }

  onSwitchChange(event: any): void {
    this.isAvailableForWork = event.checked;
  }

  processWeeklyProjectData() {
    const fullDaysOfWeek = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    const projects = this.userProfile.data()!.projects || [];
    const startOfCurrentWeek = startOfWeek(new Date(), { weekStartsOn: 0 });
    const dates = Array.from({ length: 7 }).map((_, i) =>
      formatDate(addDays(startOfCurrentWeek, i), 'yyyy-MM-dd')
    );

    const projectCounts = dates.reduce((acc: ProjectCountsInterface, date) => {
      acc[date] = 0;
      return acc;
    }, {});

    projects.forEach((project) => {
      const date = formatDate(new Date(project.created_at), 'yyyy-MM-dd');
      console.log(date);
      if (projectCounts.hasOwnProperty(date)) {
        projectCounts[date]++;
      }
    });

    const gradient = (context: any) => {
      const chart = context.chart;
      const { ctx, chartArea } = chart;
      if (!chartArea) {
        return null;
      }
      const gradient = ctx.createLinearGradient(
        0,
        chartArea.top,
        0,
        chartArea.bottom
      );
      gradient.addColorStop(0, 'rgba(234, 100, 217, 0.9)');
      gradient.addColorStop(1, 'rgba(234, 100, 217, 0)');
      return gradient;
    };

    this.weeklyChartData = {
      labels: dates.map((date, i) => daysOfWeek[new Date(date).getDay()]),
      datasets: [
        {
          label: '',
          data: Object.values(projectCounts),
          backgroundColor: gradient,
          borderColor: 'rgb(237, 171, 231)',
          borderWidth: 3,
          pointRadius: 6,
          pointHoverRadius: 8,
          pointHoverBorderWidth: 3,
          pointBackgroundColor: 'rgb(243, 244, 246)',
          pointHoverBackgroundColor: 'rgb(243, 244, 246)',
          pointHoverBorderColor: 'rgb(237, 127, 223)',
          cubicInterpolationMode: 'monotone',
          tension: 0.4,
          fill: true,
        },
      ],
    };

    this.weeklyChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            padding: 15,
            color: 'rgb(107 114 128)',
          },
          border: {
            display: false,
          },
        },
        y: {
          beginAtZero: true,
          max: 10,
          ticks: {
            display: false,
          },
          display: false,
          grid: {
            display: false,
          },
        },
      },
      elements: {
        point: {
          radius: 4,
          backgroundColor: 'rgb(237, 127, 223)',
        },
        line: {
          borderColor: 'rgb(237, 127, 223)',
          borderWidth: 2,
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: true,
          caretPadding: 14,
          yAlign: 'bottom',
          borderRadius: '0.375rem',
          padding: {
            top: 8, // 0.5rem
            right: 12, // 0.75rem
            bottom: 8, // 0.5rem
            left: 12, // 0.75rem
          },
          backgroundColor: 'rgb(0, 0, 0)',
          usePointStyle: true,
          callbacks: {
            title: (tooltipItems: any) => {
              const dateIndex = tooltipItems[0].dataIndex;
              const date = dates[dateIndex];
              return fullDaysOfWeek[new Date(date).getDay()];
            },
            label: (tooltipItem: any) => {
              return ` Published: ${tooltipItem.raw} shot(s)`;
            },
          },
          titleFont: {
            family: 'IBM Plex Mono',
            size: 16,
            style: 'normal',
            weight: 'bold',
            lineHeight: 1.2,
          },
          bodyFont: {
            family: 'Arial',
            size: 14,
            style: 'normal',
            weight: 'normal',
            lineHeight: 1.2,
          },
          footerFont: {
            family: 'Arial',
            size: 12,
            style: 'normal',
            weight: 'normal',
            lineHeight: 1.2,
          },
        },
      },
    };
  }
}
