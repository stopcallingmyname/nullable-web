import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ProfileService } from 'src/app/profile/services/profile.service';

@Component({
  selector: 'nb-confirm-delete-account',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './confirm-delete-account.component.html',
  styleUrl: './confirm-delete-account.component.scss',
})
export class ConfirmDeleteAccountComponent {
  constructor(private router: Router, private profileService: ProfileService) {}

  onDeleteAccount() {
    this.profileService.deleteCurrentProfile().subscribe({
      next: () => {
        this.router.navigateByUrl('/signup');
      },
      error: (error) => console.error(error),
    });
  }
}
