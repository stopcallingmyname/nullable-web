// import { Component, inject, Injector, OnInit } from '@angular/core';
// import {
//   ActivatedRoute,
//   Router,
//   RouterLink,
//   RouterOutlet,
// } from '@angular/router';
// import { CreateQueryResult } from '@tanstack/angular-query-experimental';

// import { AccountTab } from 'src/app/account/types/accountTabs.enum';
// import { injectCurrentProfileQuery } from 'src/app/shared/store/profile/queries/currentProfile.query';
// import { injectCurrentUserQuery } from 'src/app/shared/store/user/queries/currentUser.query';
// import { CurrentProfileInterface } from 'src/app/shared/types/currentProfile.interface';
// import { CurrentUserInterface } from 'src/app/shared/types/currentUser.interface';

// @Component({
//   selector: 'nb-account',
//   standalone: true,
//   imports: [RouterOutlet, RouterLink],
//   templateUrl: './account.component.html',
//   styleUrl: './account.component.scss',
// })
// export class AccountComponent implements OnInit {
//   accountTabs: AccountTab[] = [
//     AccountTab.General,
//     AccountTab.EditProfile,
//     AccountTab.Password,
//     AccountTab.SocialProfiles,
//   ];
//   selectedTab: AccountTab = AccountTab.EditProfile;
//   currentProfile: CreateQueryResult<CurrentProfileInterface, Error>;
//   currentUser: CreateQueryResult<CurrentUserInterface, Error>;
//   private _injector: Injector = inject(Injector);

//   constructor(
//     private _router: Router,
//     private _activatedRoute: ActivatedRoute
//   ) {}

//   ngOnInit(): void {
//     this.initializeValues();
//     this.setActiveTab();
//   }

//   // ngAfterViewInit(): void {
//   //   this.navigateToTabByUrl(this.selectedTab);
//   // }

//   initializeValues(): void {
//     this.currentProfile = injectCurrentProfileQuery({
//       injector: this._injector,
//     });
//     this.currentUser = injectCurrentUserQuery({ injector: this._injector });
//   }

//   onTabSelected(tab: AccountTab): void {
//     this.selectedTab = tab;
//     this.navigateToTabByUrl(tab);
//   }

//   navigateToTabByUrl(url: string): void {
//     this._router.navigate(['/account', url.toLowerCase().replace(' ', '-')]);
//   }

//   setActiveTab(): void {
//     this._activatedRoute.url.subscribe((segments) => {
//       const activeRoute = segments[1]?.path;
//       this.selectedTab =
//         this.accountTabs.find(
//           (tab) => tab.toLowerCase().replace(' ', '-') === activeRoute
//         ) || this.accountTabs[0];
//     });
//   }
// }

import { Component, inject, Injector, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { CreateQueryResult } from '@tanstack/angular-query-experimental';
import { filter } from 'rxjs';

import { AccountTab } from 'src/app/account/types/accountTabs.enum';
import { injectCurrentProfileQuery } from 'src/app/shared/store/profile/queries/currentProfile.query';
import { injectCurrentUserQuery } from 'src/app/shared/store/user/queries/currentUser.query';
import { CurrentProfileInterface } from 'src/app/shared/types/currentProfile.interface';
import { CurrentUserInterface } from 'src/app/shared/types/currentUser.interface';

@Component({
  selector: 'nb-account',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss',
})
export class AccountComponent implements OnInit {
  accountTabs: AccountTab[] = [
    AccountTab.General,
    AccountTab.EditProfile,
    AccountTab.Password,
    AccountTab.SocialProfiles,
  ];
  selectedTab: AccountTab = AccountTab.EditProfile;
  currentProfile: CreateQueryResult<CurrentProfileInterface, Error>;
  currentUser: CreateQueryResult<CurrentUserInterface, Error>;
  private _injector: Injector = inject(Injector);

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute
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
    this.currentProfile = injectCurrentProfileQuery({
      injector: this._injector,
    });
    this.currentUser = injectCurrentUserQuery({ injector: this._injector });
  }

  initializeTabs(): void {
    this.accountTabs = [
      AccountTab.General,
      AccountTab.EditProfile,
      AccountTab.Password,
      AccountTab.SocialProfiles,
    ];
  }

  onTabSelected(tab: AccountTab): void {
    this.selectedTab = tab;
    this.navigateToTabByUrl(tab);
  }

  navigateToTabByUrl(tab: AccountTab): void {
    this._router.navigate(['/account', tab.toLowerCase().replace(' ', '-')]);
  }

  setActiveTab(): void {
    this._activatedRoute.firstChild?.url.subscribe((segments) => {
      const activeRoute = segments[0]?.path;
      this.selectedTab =
        this.accountTabs.find(
          (tab) => tab.toLowerCase().replace(' ', '-') === activeRoute
        ) || this.accountTabs[0];
    });
    // this.navigateToTabByUrl(this.selectedTab);
    if (!this._activatedRoute.firstChild) {
      this.navigateToTabByUrl(this.selectedTab);
    }
  }
}
