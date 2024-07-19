import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  Injector,
  OnInit,
} from '@angular/core';
import {
  RouterOutlet,
  RouterLink,
  Router,
  ActivatedRoute,
} from '@angular/router';
import { FloatingService } from '@ngx-popovers/core';
import { PopoverModule } from '@ngx-popovers/popover';
import { CreateQueryResult } from '@tanstack/angular-query-experimental';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { DropdownModule } from 'primeng/dropdown';
import { CarouselModule } from 'primeng/carousel';

import { ViewShotsComponent } from 'src/app/home/components/view-shots/view-shots/view-shots.component';
import { injectAllProfilesQuery } from 'src/app/shared/store/profile/queries/allProfiles.query';
import { injectCurrentUserQuery } from 'src/app/shared/store/user/queries/currentUser.query';
import { CurrentProfileInterface } from 'src/app/shared/types/currentProfile.interface';
import { CurrentUserInterface } from 'src/app/shared/types/currentUser.interface';
import { TagInterface } from 'src/app/shared/types/tag.interface';
import { injectAllTagsQuery } from 'src/app/project/store/project/queries/allTagsQuery';
import { ProjectInterface } from 'src/app/project/types/project.interface';
import { injectSearchProjectsQuery } from 'src/app/project/store/project/queries/searchprojects.query';
import { SearchProjectRequestInterface } from 'src/app/project/types/searchProjectsRequest.interface';
import { injectAllProjectsQuery } from 'src/app/profile/store/profile/queries/allProjects.query';

interface DropdownOption {
  key: string;
  value: string;
}

@Component({
  selector: 'nb-shots',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    PopoverModule,
    NgxSpinnerModule,
    ViewShotsComponent,
    DropdownModule,
    CarouselModule,
  ],
  providers: [FloatingService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './shots.component.html',
  styleUrl: './shots.component.scss',
})
export class ShotsComponent implements OnInit {
  currentUser: CreateQueryResult<CurrentUserInterface, Error>;
  allProfiles: CreateQueryResult<CurrentProfileInterface[], Error>;
  private injector = inject(Injector);
  pages: DropdownOption[] = [];
  selectedPage: DropdownOption | null = null;
  allTags: CreateQueryResult<TagInterface[], Error>;
  searchProjectsQuery: CreateQueryResult<ProjectInterface[], Error>;
  allProjects: CreateQueryResult<ProjectInterface[], Error>;

  constructor(
    private spinner: NgxSpinnerService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initializeValues();
  }

  initializeValues(): void {
    this.currentUser = injectCurrentUserQuery({ injector: this.injector });
    this.allProfiles = injectAllProfilesQuery({
      injector: this.injector,
    });
    this.allProjects = injectAllProjectsQuery({
      injector: this.injector,
    });
    this.allTags = injectAllTagsQuery({ injector: this.injector });

    this.pages = [
      { key: 'Popular', value: 'popular' },
      { key: 'New & Noteworthy', value: 'new' },
    ];

    if (this.currentUser) {
      this.pages.unshift({ key: 'Following', value: 'following' });
    }

    if (this.currentUser && !this.selectedPage) {
      this.selectedPage = this.pages[0];
      this.router.navigate(['/following']);
    } else {
      this.selectedPage = this.pages[1];
      this.router.navigate(['/popular']);
    }
    this.updateProjects(this.selectedPage.value);
  }

  onPageChange(event: any) {
    const selectedValue = event.value.value;
    this.router.navigate([selectedValue]);
    this.updateProjects(selectedValue);
  }

  updateProjects(sortBy: string) {
    const page = this.pages.find((page) => page.value === sortBy);
    if (page) {
      this.selectedPage = page;
      this.showFilteredProjects({
        search: '',
        sortBy: sortBy as 'new' | 'popular' | 'following',
        tags: [],
      });
    }
  }

  showFilteredProjects(dto: SearchProjectRequestInterface) {
    this.searchProjectsQuery = injectSearchProjectsQuery(
      { dto: dto },
      { injector: this.injector }
    );
  }

  onFilterProjects(event: any, tag: TagInterface) {
    // this.showFilteredProjects({})
  }

  updateLoadingSpinner(): boolean {
    if (
      this.searchProjectsQuery.isPending() ||
      this.searchProjectsQuery.isRefetching()
    ) {
      return true;
    } else {
      return false;
    }
  }
}
