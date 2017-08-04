import { Component } from '@angular/core';

export class Hero {
  id: number;
  name: string;
}

@Component({
moduleId: __moduleName,
  selector: 'my-app',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'Tour of Heroes';
}


/*
Copyright 2017 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/