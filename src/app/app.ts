import { Component } from '@angular/core';
import { Shell } from './core/layout/shell/shell';

@Component({
  selector: 'rf-root',
  imports: [Shell],
  template: '<rf-shell />',
})
export class App {}
