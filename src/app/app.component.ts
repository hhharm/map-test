import {Component, OnInit} from '@angular/core';


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

}
