import { Component, inject, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CreateQueryResult } from '@tanstack/angular-query-experimental';
import { injectViewProjectQuery } from 'src/app/project/store/project/queries/viewProject.query';
import { ProjectInterface } from 'src/app/project/types/project.interface';

@Component({
  selector: 'nb-project',
  standalone: true,
  imports: [],
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss',
})
export class ProjectComponent implements OnInit {
  currentProject: CreateQueryResult<ProjectInterface, Error>;
  private _injector = inject(Injector);

  constructor(private _route: ActivatedRoute) {}

  ngOnInit(): void {
    this.initializeValues();
  }

  initializeValues() {
    const projectId = this._route.snapshot.paramMap.get('id') || undefined;
    this.currentProject = injectViewProjectQuery(
      { pid: projectId },
      { injector: this._injector }
    );
  }
}
