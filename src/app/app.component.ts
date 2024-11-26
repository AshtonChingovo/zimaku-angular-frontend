import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { ChicksComponent } from './production/chicks/chicks.component';
import { HomeComponent } from './home/home.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HomeComponent, ChicksComponent, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'angular';

}
