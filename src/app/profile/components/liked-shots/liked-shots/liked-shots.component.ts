import { CommonModule } from '@angular/common';
import { Component, inject, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { ionEye, ionHeartOutline } from '@ng-icons/ionicons';
import { octHeartFill, octTriangleUp } from '@ng-icons/octicons';
import { CreateQueryResult } from '@tanstack/angular-query-experimental';
import { MessageService } from 'primeng/api';

import { injectLikeProjectMutation } from 'src/app/profile/store/profile/mutations/likeProject.mutation';
import { injectLikedProjectsByUsernameQuery } from 'src/app/project/store/project/queries/likedProjectsByUsername.query copy';
import { ProjectInterface } from 'src/app/project/types/project.interface';
import { injectUserProfileByUsernameQuery } from 'src/app/shared/store/profile/queries/userProfileByUsername.query';
import { CurrentProfileInterface } from 'src/app/shared/types/currentProfile.interface';

@Component({
  selector: 'nb-liked-shots',
  standalone: true,
  imports: [NgIconComponent, RouterLink, CommonModule],
  providers: [MessageService],
  templateUrl: './liked-shots.component.html',
  styleUrl: './liked-shots.component.scss',
  viewProviders: [
    provideIcons({ octTriangleUp, ionHeartOutline, octHeartFill, ionEye }),
  ],
})
export class LikedShotsComponent implements OnInit {
  userProfile: CreateQueryResult<CurrentProfileInterface, Error>;
  likedProjects: CreateQueryResult<ProjectInterface[], Error>;
  private _likeProjectMutation: any;
  private _injector = inject(Injector);
  constructor(private _activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.initializeValues();
  }
  onProjectClicked(event: Event): void {}

  onLikeProject(event: Event, project: ProjectInterface): void {
    event.stopPropagation();

    this._likeProjectMutation = injectLikeProjectMutation(
      { injector: this._injector },
      { projectId: project.id }
    );

    this._likeProjectMutation.mutate({ title: 'like-project-mutation' });
  }

  initializeValues(): void {
    this._activatedRoute.parent?.paramMap.subscribe((params) => {
      const username: string | null = params.get('username');
      if (username) {
        this.userProfile = injectUserProfileByUsernameQuery(
          { username: username },
          { injector: this._injector }
        );
        this.likedProjects = injectLikedProjectsByUsernameQuery(
          { username: username },
          {
            injector: this._injector,
          }
        );
      }
    });
  }
}
