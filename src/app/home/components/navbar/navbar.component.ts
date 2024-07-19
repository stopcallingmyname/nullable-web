import { Component, inject, Injector, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FloatingService } from '@ngx-popovers/core';
import { PopoverModule } from '@ngx-popovers/popover';
import { CreateQueryResult } from '@tanstack/angular-query-experimental';
import { TooltipModule } from 'primeng/tooltip';

import { injectLogoutUserMutation } from 'src/app/auth/store/user/mutations/logoutUser.mutation';
import { injectCurrentUserQuery } from 'src/app/shared/store/user/queries/currentUser.query';
import { CurrentUserInterface } from 'src/app/shared/types/currentUser.interface';

@Component({
  selector: 'nb-navbar',
  standalone: true,
  imports: [RouterLink, PopoverModule, TooltipModule],
  providers: [FloatingService],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  currentUser: CreateQueryResult<CurrentUserInterface, Error>;
  private injector = inject(Injector);
  private logoutUserMutation: any;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.initializeValues();
  }

  initializeValues(): void {
    this.currentUser = injectCurrentUserQuery({ injector: this.injector });
    this.logoutUserMutation = injectLogoutUserMutation({
      injector: this.injector,
    });
  }

  onLogout(): void {
    this.logoutUserMutation.mutate(
      { title: 'logout-user-mutation' },
      {
        onSuccess: () => {
          // @ts-ignore
          google.accounts.id.disableAutoSelect();
          this.router.navigateByUrl('/');
        },
      }
    );
  }
}
