import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { ionEye, ionHeartOutline } from '@ng-icons/ionicons';
import { octHeartFill, octTriangleUp } from '@ng-icons/octicons';
import { CreateQueryResult } from '@tanstack/angular-query-experimental';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { injectLikeProjectMutation } from 'src/app/profile/store/profile/mutations/likeProject.mutation';
import { injectUserProjectsByUsernameQuery } from 'src/app/project/store/project/queries/userProjectsByUsername.query';
import { ProjectInterface } from 'src/app/project/types/project.interface';
import { injectUserProfileByUsernameQuery } from 'src/app/shared/store/profile/queries/userProfileByUsername.query';

import { CurrentProfileInterface } from 'src/app/shared/types/currentProfile.interface';
import { LikeButtonComponent } from '../../../../shared/components/like-button/like-button.component';

@Component({
  selector: 'nb-work',
  standalone: true,
  imports: [
    NgIconComponent,
    RouterLink,
    ToastModule,
    CommonModule,
    LikeButtonComponent,
  ],
  providers: [MessageService],
  templateUrl: './work.component.html',
  styleUrl: './work.component.scss',
  viewProviders: [
    provideIcons({ octTriangleUp, ionHeartOutline, octHeartFill, ionEye }),
  ],
})
export class WorkComponent implements OnInit {
  userProfile: CreateQueryResult<CurrentProfileInterface, Error>;
  userProjects: CreateQueryResult<ProjectInterface[], Error>;
  private _likeProjectMutation: any;
  private _injector = inject(Injector);
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _messageService: MessageService
  ) {}

  ngOnInit() {
    this.initializeValues();
  }
  onProjectClicked(event: Event): void {}

  initializeValues(): void {
    this._activatedRoute.parent?.paramMap.subscribe((params) => {
      const username: string | null = params.get('username');
      if (username) {
        this.userProfile = injectUserProfileByUsernameQuery(
          { username: username },
          { injector: this._injector }
        );
        this.userProjects = injectUserProjectsByUsernameQuery(
          { username: username },
          {
            injector: this._injector,
          }
        );
      }
    });
  }
}
