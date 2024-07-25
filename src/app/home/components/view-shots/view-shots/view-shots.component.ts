import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, Injector, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { ionHeartOutline, ionEye } from '@ng-icons/ionicons';
import { octTriangleUp, octHeartFill } from '@ng-icons/octicons';
import { CreateQueryResult } from '@tanstack/angular-query-experimental';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { injectLikeProjectMutation } from 'src/app/profile/store/profile/mutations/likeProject.mutation';
import { injectAllProjectsQuery } from 'src/app/profile/store/profile/queries/allProjects.query';
import { ProjectInterface } from 'src/app/project/types/project.interface';
import { CurrentUserInterface } from 'src/app/shared/types/currentUser.interface';

@Component({
  selector: 'nb-view-shots',
  standalone: true,
  imports: [NgIconComponent, RouterLink, ToastModule, CommonModule],
  providers: [MessageService],
  templateUrl: './view-shots.component.html',
  styleUrl: './view-shots.component.scss',
  viewProviders: [
    provideIcons({ octTriangleUp, ionHeartOutline, octHeartFill, ionEye }),
  ],
})
export class ViewShotsComponent {
  private _likeProjectMutation: any;
  private _injector = inject(Injector);
  @Input() projects: ProjectInterface[] | null;
  @Input() projectsToShow?: number | null;

  constructor(private _messageService: MessageService) {}

  onProjectClicked(event: Event): void {}

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

  get limitedProjects(): ProjectInterface[] {
    if (this.projectsToShow !== undefined && this.projectsToShow !== null) {
      return this.projects!.slice(0, this.projectsToShow) || [];
    } else {
      return this.projects || [];
    }
  }
}
