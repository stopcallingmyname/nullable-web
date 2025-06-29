import {
  Component,
  computed,
  effect,
  inject,
  Injector,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CreateQueryResult } from '@tanstack/angular-query-experimental';
import { injectViewProjectQuery } from 'src/app/project/store/project/queries/viewProject.query';
import { ProjectInterface } from 'src/app/project/types/project.interface';
import { ImageModule } from 'primeng/image';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { ToastModule } from 'primeng/toast';
import { injectLikeProjectMutation } from 'src/app/profile/store/profile/mutations/likeProject.mutation';
import { ionHeartOutline, ionEye } from '@ng-icons/ionicons';
import { octMail, octClock } from '@ng-icons/octicons';
import { injectFollowUserMutation } from 'src/app/profile/store/profile/mutations/followUser.mutation';
import { BackButtonComponent } from '../../../../shared/components/back-button/back-button.component';
import { LikeButtonComponent } from '../../../../shared/components/like-button/like-button.component';
import { CurrentProfileInterface } from 'src/app/shared/types/currentProfile.interface';
import { injectUserProfileByUidQuery } from 'src/app/shared/store/profile/queries/userProfileByUid.query';
import { CurrentUserInterface } from 'src/app/shared/types/currentUser.interface';
import { injectCurrentUserQuery } from 'src/app/shared/store/user/queries/currentUser.query';
import { injectUserByProfileIdQuery } from 'src/app/shared/store/user/queries/userByProfileId.query';

@Component({
  selector: 'nb-project',
  standalone: true,
  imports: [
    NgIconComponent,
    ToastModule,
    CommonModule,
    ImageModule,
    RouterLink,
    BackButtonComponent,
    LikeButtonComponent,
  ],
  providers: [MessageService],
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss',
  viewProviders: [provideIcons({ ionHeartOutline, octMail, octClock })],
})
export class ProjectComponent implements OnInit {
  // currentProject: CreateQueryResult<ProjectInterface, Error>;
  // creator: CreateQueryResult<CurrentUserInterface, Error>;
  private _followUserMutation: any;
  private _likeProjectMutation: any;
  private _injector = inject(Injector);

  readonly projectId = this._route.snapshot.paramMap.get('id')!;
  readonly currentProject = injectViewProjectQuery(
    { pid: this.projectId },
    { injector: this._injector }
  );

  readonly profileId = computed(() => this.currentProject.data()?.creator.id);

  readonly creator = computed(() => {
    const pid = this.profileId();
    return pid
      ? injectUserByProfileIdQuery(
          { profile_id: pid },
          { injector: this._injector }
        )
      : null;
  });

  constructor(
    private _route: ActivatedRoute,
    private _messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.initializeValues();
  }

  initializeValues() {
    // const projectId = this._route.snapshot.paramMap.get('id') || undefined;
    // this.currentProject = injectViewProjectQuery(
    //   { pid: projectId },
    //   { injector: this._injector }
    // );
    // const profileId = this.currentProject.data()?.creator.id;
    // console.log(profileId);
    // this.creator = injectUserByProfileIdQuery(
    //   { profile_id: profileId },
    //   { injector: this._injector }
    // );
    // console.log(this.creator.data());

    effect(() => {
      const pid = this.profileId();
      console.log('🧠 profileId:', pid);
    });

    effect(() => {
      const creatorData = this.creator()?.data();
      if (creatorData) {
        console.log('👤 Creator loaded:', creatorData);
      }
    });
  }

  onFollow(): void {
    this._followUserMutation = injectFollowUserMutation(
      { injector: this._injector },
      { newData: { followee_id: this.currentProject.data()!.creator.id } }
    );

    this._followUserMutation.mutate(
      { title: 'follow-user-mutation' },
      {
        onError: (error: HttpErrorResponse) => {
          this._messageService.add({
            summary: 'Oops! 😅',
            detail:
              'You need to log in first to follow this user. It only takes a second! 🚀',
          });
        },
      }
    );
  }

  onLikeProject(event: Event, project: ProjectInterface): void {
    event.stopPropagation();

    this._likeProjectMutation = injectLikeProjectMutation(
      { injector: this._injector },
      { projectId: project.id }
    );

    this._likeProjectMutation.mutate(
      { title: 'like-project-mutation' },
      {
        onError: (error: HttpErrorResponse) => {
          this._messageService.add({
            summary: 'Oops! 😅',
            detail:
              'Something went wrong. Please, try again it only takes a second! 🚀',
          });
        },
      }
    );
  }
}
