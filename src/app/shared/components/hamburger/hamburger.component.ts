import {
  Component,
  signal,
  WritableSignal,
  HostListener,
  ElementRef,
  Input,
  computed,
  Signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, MessageService, PrimeIcons } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { PanelMenuModule } from 'primeng/panelmenu';

type MenuState = 'opening' | 'open' | 'closing' | 'closed';

@Component({
  selector: 'ng-hamburger',
  standalone: true,
  imports: [CommonModule, PanelMenuModule],
  providers: [MessageService],
  templateUrl: './hamburger.component.html',
  styleUrl: './hamburger.component.scss',
})
export class HamburgerComponent {
  @Input() navbarHeight: number = 56;

  menuState: WritableSignal<MenuState> = signal('closed');

  readonly isVisible: Signal<boolean> = computed(
    () => this.menuState() !== 'closed'
  );
  readonly isFadingOut: Signal<boolean> = computed(
    () => this.menuState() === 'closing'
  );
  readonly isFadingIn: Signal<boolean> = computed(
    () => this.menuState() === 'opening'
  );
  readonly isOpen: Signal<boolean> = computed(
    () => this.menuState() === 'open'
  );

  menuItems: MenuItem[] = [
    {
      label: 'Explore',
      items: [
        {
          label: 'Popular',
          icon: PrimeIcons.CHART_BAR,
          command: () => {
            this.router.navigate(['/popular']);
          },
        },
        {
          label: 'New and Noteworthy',
          icon: PrimeIcons.SPARKLES,
          command: () => {
            this.router.navigate(['/new']);
          },
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
        {
          label: 'Browse Freelancers',
          icon: PrimeIcons.SEARCH,
          command: () => {
            this.router.navigate(['/']);
          },
        },
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

  constructor(private elementRef: ElementRef, private router: Router) {}

  toggleMenu(): void {
    if (this.menuState() === 'open') {
      this.startClosing();
    } else {
      this.startOpening();
    }
  }

  closeMenu(): void {
    if (this.menuState() === 'open') {
      this.startClosing();
    }
  }

  private startOpening(): void {
    this.menuState.set('opening');

    requestAnimationFrame(() => {
      this.menuState.set('open');
    });
  }

  private startClosing(): void {
    this.menuState.set('closing');
    setTimeout(() => {
      this.menuState.set('closed');
    }, 300);
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (
      this.menuState() === 'open' &&
      !this.elementRef.nativeElement.contains(event.target)
    ) {
      this.closeMenu();
    }
  }
}
