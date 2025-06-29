import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  Injector,
  OnInit,
} from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { FloatingService } from '@ngx-popovers/core';
import { PopoverModule } from '@ngx-popovers/popover';
import { CreateQueryResult } from '@tanstack/angular-query-experimental';

import { NavbarComponent } from '../navbar/navbar.component';
import { CurrentUserInterface } from 'src/app/shared/types/currentUser.interface';
import { injectCurrentUserQuery } from 'src/app/shared/store/user/queries/currentUser.query';
import { CurrentProfileInterface } from 'src/app/shared/types/currentProfile.interface';
import { injectAllProfilesQuery } from 'src/app/shared/store/profile/queries/allProfiles.query';
import { ViewShotsComponent } from '../view-shots/view-shots/view-shots.component';

@Component({
  selector: 'nb-home',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    PopoverModule,
    NgxSpinnerModule,
    NavbarComponent,
    ViewShotsComponent,
  ],
  providers: [FloatingService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  currentUser: CreateQueryResult<CurrentUserInterface, Error>;
  allProfiles: CreateQueryResult<CurrentProfileInterface[], Error>;
  logoutUserMutation: any;
  private injector = inject(Injector);

  constructor(private spinner: NgxSpinnerService, private router: Router) {}

  ngOnInit(): void {
    this.initializeValues();
  }

  initializeValues(): void {
    this.currentUser = injectCurrentUserQuery({ injector: this.injector });
    this.allProfiles = injectAllProfilesQuery({
      injector: this.injector,
    });
  }

  updateLoadingSpinner(): boolean {
    if (this.currentUser.isPending() || this.currentUser.isRefetching()) {
      return true;
    } else {
      return false;
    }
  }
}
