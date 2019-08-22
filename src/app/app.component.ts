import {Component, OnInit} from '@angular/core';

type Target = 'EXP' | 'CODE' | 'RESULT';

export interface LogMessage {
  id: string;
  type: 'IN' | 'OUT' | 'KITCHEN';
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  _showCode: boolean;
  _showExplanation: boolean;

  ngOnInit(): void {
  }

  toggle(target: Target) {
    switch (target) {
      case 'CODE': {
        this._showCode = true;
        this._showExplanation = false;
        break;
      }
      case 'EXP': {
        this._showExplanation = true;
        this._showCode = false;
        break;
      }
      case 'RESULT': {
        this._showExplanation = false;
        this._showCode = false;
        break;
      }
    }
  }
}
