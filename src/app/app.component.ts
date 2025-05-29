import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AboutMeSectionComponent } from "./about-me-section/about-me-section.component";
import { HeaderComponent } from "./shared/header/header.component";
import { AppBtnComponent } from "./app-btn/app-btn.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AboutMeSectionComponent, HeaderComponent, AppBtnComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'portfolio-temp';
}
