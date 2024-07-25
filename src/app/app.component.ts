import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationStart,
  Router,
  RouterOutlet,
} from '@angular/router';

import { NgxSpinnerModule } from 'ngx-spinner';
import { AngularQueryDevtools } from '@tanstack/angular-query-devtools-experimental';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'nb-root',
  standalone: true,
  imports: [RouterOutlet, NgxSpinnerModule, AngularQueryDevtools],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'NULLABLE';

  constructor(private primengConfig: PrimeNGConfig) {}

  ngOnInit() {
    this.primengConfig.ripple = true;
  }

  // constructor(private router: Router, private loading: NgxSpinnerService) {
  //   router.events.subscribe((event) => {
  //     if (event instanceof NavigationStart) {
  //       loading.show();
  //     } else if (
  //       event instanceof NavigationEnd ||
  //       event instanceof NavigationCancel
  //     ) {
  //       setTimeout(() => {
  //         loading.hide();
  //       }, 700);
  //     }
  //   });
  // }
}
