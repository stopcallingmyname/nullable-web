import { Component, Input, inject, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { ionHeartOutline } from '@ng-icons/ionicons';
import { octHeartFill } from '@ng-icons/octicons';
import { injectLikeProjectMutation } from 'src/app/profile/store/profile/mutations/likeProject.mutation';
import { ProjectInterface } from 'src/app/project/types/project.interface';

@Component({
  selector: 'nb-like-button',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  providers: [MessageService],
  viewProviders: [provideIcons({ ionHeartOutline, octHeartFill })],
  templateUrl: './like-button.component.html',
  styleUrl: './like-button.component.scss',
})
export class LikeButtonComponent {
  @Input() project!: ProjectInterface;

  private _injector = inject(Injector);
  private _messageService = inject(MessageService);
  private _likeProjectMutation: any;

  onLikeProject(event: Event): void {
    event.stopPropagation();

    this._likeProjectMutation = injectLikeProjectMutation(
      { injector: this._injector },
      { projectId: this.project.id }
    );

    this._likeProjectMutation.mutate(
      { title: 'like-project-mutation' },
      {
        onError: () => {
          this._messageService.add({
            summary: 'Oops! 😅',
            detail:
              'Something went wrong. Please, try again – it only takes a second! 🚀',
          });
        },
      }
    );
  }
}
