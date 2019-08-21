import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {ShowPipe} from './showPipe';
import {ExplanationComponent} from './explanation/explanation.component';
import {CodeComponent} from './code/code.component';
import {ResultsComponent} from './results/results.component';

@NgModule({
  declarations: [
    AppComponent,
    ShowPipe,
    ExplanationComponent,
    CodeComponent,
    ResultsComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
