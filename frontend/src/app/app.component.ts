import {Component, inject} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private readonly translate = inject(TranslateService);

  constructor() {
    const saved = localStorage.getItem('lang');
    const browser = this.translate.getBrowserLang();
    const lang = saved || (browser === 'de' ? 'de' : 'en');

    this.translate.addLangs(['de', 'en']);
    this.translate.use(lang);
  }
}
