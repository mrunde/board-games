import {Component, inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [FormsModule],
  template: `
    <button
      type="button"
      class="language-button"
      [title]="nextLang === 'de' ? 'Deutsch' : 'English'"
      (click)="toggleLang()"
    >
      <img
        class="language-flag"
        [src]="nextLang === 'de' ? 'assets/flags/de.svg' : 'assets/flags/en.svg'"
        [alt]="nextLang === 'de' ? 'Deutsch' : 'English'"
      />
    </button>
  `,
  styles: [`
    .language-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      padding: 0;
      border: none;
      border-radius: 50%;
      background: transparent;
      cursor: pointer;
      overflow: hidden;
    }

    .language-button:hover {
      background: rgba(0, 0, 0, 0.04);
    }

    .language-button:focus-visible {
      outline: 2px solid currentColor;
      outline-offset: 2px;
    }

    .language-flag {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      object-fit: cover;
      display: block;
    }
  `]
})
export class LanguageSwitcherComponent {
  private readonly translate = inject(TranslateService);
  current = this.translate.getCurrentLang() || this.translate.getFallbackLang() || 'en';

  get nextLang(): 'en' | 'de' {
    return this.current === 'en' ? 'de' : 'en';
  }

  toggleLang(): void {
    const next = this.current === 'en' ? 'de' : 'en';
    this.current = next;
    this.translate.use(next);
    localStorage.setItem('lang', next);
  }
}
