import { Component } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { octArrowLeft } from '@ng-icons/octicons';
import { Location } from '@angular/common';

@Component({
  selector: 'nb-back-button',
  standalone: true,
  imports: [NgIconComponent],
  templateUrl: './back-button.component.html',
  styleUrl: './back-button.component.scss',
  viewProviders: [provideIcons({ octArrowLeft })],
})
export class BackButtonComponent {
  constructor(private _location: Location) {}

  goBack() {
    this._location.back();
  }
}
