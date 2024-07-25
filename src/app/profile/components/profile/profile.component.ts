import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  Injector,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
} from '@angular/router';
import { PopoverModule } from '@ngx-popovers/popover';
import { CreateQueryResult } from '@tanstack/angular-query-experimental';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { MenuItem, MessageService } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { TabMenuModule } from 'primeng/tabmenu';
import { Dialog, DialogModule } from 'primeng/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastModule } from 'primeng/toast';
import { filter } from 'rxjs';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { octXCircleFill } from '@ng-icons/octicons';

import { injectUserProfileByUsernameQuery } from 'src/app/shared/store/profile/queries/userProfileByUsername.query';
import { CurrentProfileInterface } from 'src/app/shared/types/currentProfile.interface';
import { injectFollowUserMutation } from '../../store/profile/mutations/followUser.mutation';
import { injectUnfollowUserMutation } from '../../store/profile/mutations/unfollowUser.mutation';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  selector: 'nb-profile',
  standalone: true,
  imports: [
    RouterLink,
    NgxSpinnerModule,
    PopoverModule,
    TabMenuModule,
    AvatarModule,
    CommonModule,
    ToastModule,
    NgIconComponent,
    DialogModule,
  ],
  providers: [MessageService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  viewProviders: [provideIcons({ octXCircleFill })],
})
export class ProfileComponent implements OnInit {
  userProfile: CreateQueryResult<CurrentProfileInterface, Error>;
  private _injector = inject(Injector);
  tabs: MenuItem[] | undefined;
  activeTab: MenuItem | undefined;
  private _followUserMutation: any;
  private _unfollowUserMutation: any;
  private _username: string | null;
  isOpenToWork: boolean;
  @ViewChild('availableForWorkDialog') availableForWorkDialog: Dialog;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _spinner: NgxSpinnerService,
    private _messageService: MessageService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.initializeValues();
    this.initializeTabs();
    this.setActiveTab();

    this._router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.setActiveTab();
      });
  }

  initializeValues(): void {
    this.getUserProfileByRouteParams();
  }

  initializeTabs(): void {
    this.tabs = [
      {
        label: 'Work',
        route: 'work',
        command: () => {
          this._router.navigate(['/', this._username, 'work']);
        },
      },
      // {
      //   label: 'Collections',
      //   route: 'collections',
      //   command: () => {
      //     this._router.navigate(['/', this._username, 'collections']);
      //   },
      // },
      {
        label: 'Liked Shots',
        route: 'likes',
        command: () => {
          this._router.navigate(['/', this._username, 'likes']);
        },
      },
      {
        label: 'About',
        route: 'about',
        command: () => {
          this._router.navigate(['/', this._username, 'about']);
        },
      },
    ];
  }

  setActiveTab(): void {
    const activeRoute =
      this._activatedRoute.snapshot.firstChild?.routeConfig?.path;
    if (activeRoute) {
      this.activeTab = this.tabs?.find((tab) => tab['route'] === activeRoute);
    } else {
      this._router.navigate(['/', this._username, 'work']);
      this.activeTab = this.tabs?.find((tab) => tab['route'] === 'work');
    }
  }

  getUserProfileByRouteParams() {
    this._activatedRoute.paramMap.subscribe((params) => {
      this._username = params.get('username');
      if (this._username) {
        this.userProfile = injectUserProfileByUsernameQuery(
          { username: this._username },
          { injector: this._injector }
        );
      }
    });
  }

  onFollow(): void {
    this._followUserMutation = injectFollowUserMutation(
      { injector: this._injector },
      { newData: { followee_id: this.userProfile.data()!.id } }
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

  onUnfollow(): void {
    this._unfollowUserMutation = injectUnfollowUserMutation(
      { injector: this._injector },
      { newData: { followee_id: this.userProfile.data()!.id } }
    );

    this._unfollowUserMutation.mutate({ title: 'unfollow-user-mutation' });
  }

  updateLoadingSpinner(): boolean {
    if (this.userProfile.isPending() || this.userProfile.isRefetching()) {
      return true;
    } else {
      return false;
    }
  }

  hideAvailableForWorkDialog(event: Event) {
    this.availableForWorkDialog.close(event);
  }
}
