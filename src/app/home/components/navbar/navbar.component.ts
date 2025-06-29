import {
  Component,
  ElementRef,
  inject,
  Injector,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FloatingService } from '@ngx-popovers/core';
import { PopoverModule } from '@ngx-popovers/popover';
import { CreateQueryResult } from '@tanstack/angular-query-experimental';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { octAlertFill } from '@ng-icons/octicons';
import { TooltipModule } from 'primeng/tooltip';

import { injectLogoutUserMutation } from 'src/app/auth/store/user/mutations/logoutUser.mutation';
import { injectCurrentUserQuery } from 'src/app/shared/store/user/queries/currentUser.query';
import { CurrentUserInterface } from 'src/app/shared/types/currentUser.interface';
import { HamburgerComponent } from 'src/app/shared/components/hamburger/hamburger.component';
import { MenuItem, PrimeIcons } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'nb-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    PopoverModule,
    NgIconComponent,
    TooltipModule,
    HamburgerComponent,
    MenubarModule,
  ],
  providers: [FloatingService],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  viewProviders: [provideIcons({ octAlertFill })],
})
export class NavbarComponent implements OnInit {
  currentUser: CreateQueryResult<CurrentUserInterface, Error>;
  private injector = inject(Injector);
  private logoutUserMutation: any;

  menuItems: MenuItem[] = [
    {
      label: 'Explore',
      items: [
        { label: 'Popular', icon: PrimeIcons.CHART_BAR, route: '/' },
        {
          label: 'New and Noteworthy',
          icon: PrimeIcons.SPARKLES,
          route: '/',
        },
        { separator: true },
        { label: 'Product Design' },
        { label: 'Web Design' },
        { label: 'Animation Design' },
        { label: 'Branding Design' },
        { label: 'Illustration' },
        { label: 'Typography' },
      ],
    },
    {
      label: 'Hire a Designer',
      items: [
        { label: 'Browse Freelancers', icon: PrimeIcons.SEARCH, route: '/' },
      ],
    },
    {
      label: 'Inspiration',
      command: () => {
        this.router.navigate(['/new']);
      },
      escape: true,
    },
  ];

  @ViewChild('navbar', { static: true })
  private navbarElement!: ElementRef<HTMLElement>;

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

  getNavbarHeight(): number {
    return this.navbarElement.nativeElement.getBoundingClientRect().height;
  }
}
