import {NgForOf, NgIf} from "@angular/common";
import {Component, Inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {TranslatePipe} from '@ngx-translate/core';
import {GameDetail} from '../models/game.model';

@Component({
  selector: 'game-edit-dialog',
  standalone: true,
  imports: [
    FormsModule,
    MatButton,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatFormFieldModule,
    MatInput,
    TranslatePipe,
    NgForOf,
    NgIf
  ],
  template: `
    <h2 mat-dialog-title>{{ 'common.edit' | translate }}</h2>

    <mat-dialog-content class="dialog-content">
      <div class="dialog-spacer"></div>

      <mat-form-field appearance="outline">
        <mat-label>{{ 'game.name' | translate }}</mat-label>
        <input matInput [(ngModel)]="model.name">
      </mat-form-field>

      <div class="rating-field">
        <label>{{ 'game.ratingPersonal' | translate }}</label>
        <div class="rating-stars" role="radiogroup">
          <button
            type="button"
            *ngFor="let star of ratingStars"
            class="rating-star"
            [class.selected]="star <= (model.ratingPersonal ?? 0)"
            (click)="model.ratingPersonal = star">
            ★
          </button>
        </div>
        <p class="rating-text" *ngIf="model.ratingPersonal">
          {{ 'rating.' + model.ratingPersonal | translate }}
        </p>
      </div>

      <mat-form-field appearance="outline">
        <mat-label>{{ 'game.spotifyUrl' | translate }}</mat-label>
        <input matInput [(ngModel)]="model.spotifyUrl">
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>{{ 'game.notes' | translate }}</mat-label>
        <textarea matInput rows="5" [(ngModel)]="model.notes"></textarea>
      </mat-form-field>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button type="button" (click)="close()">
        {{ 'common.cancel' | translate }}
      </button>
      <button mat-flat-button color="primary" type="button" (click)="save()">
        {{ 'common.save' | translate }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-spacer {
      height: 8px;
    }

    .dialog-content {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding-top: 16px;
      min-width: min(680px, 86vw);
    }

    .rating-field {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .rating-field label {
      font-size: 0.875rem;
      font-weight: 500;
    }

    .rating-stars {
      display: flex;
      gap: 2px;
    }

    .rating-star {
      border: 0;
      background: transparent;
      color: #bdbdbd;
      cursor: pointer;
      font-size: 1.8rem;
      line-height: 1;
      padding: 0 2px;
    }

    .rating-star.selected {
      color: #f6bf26;
    }

    .rating-text {
      margin: 0;
      color: rgba(0, 0, 0, 0.64);
      font-size: 0.875rem;
    }

    textarea {
      resize: vertical;
    }
  `]
})
export class GameEditDialogComponent {
  model: GameDetail = structuredClone(this.data);

  ratingStars = Array.from({length: 10}, (_, index) => index + 1);

  constructor(
    private readonly dialogRef: MatDialogRef<GameEditDialogComponent, GameDetail>,
    @Inject(MAT_DIALOG_DATA) private readonly data: GameDetail
  ) {
  }

  close(): void {
    this.dialogRef.close();
  }

  save(): void {
    this.model.ratingPersonal =
      this.model.ratingPersonal == null ? null : Math.round(this.model.ratingPersonal);
    this.dialogRef.close({
      ...this.model,
      name: this.model.name.trim(),
      spotifyUrl: this.model.spotifyUrl?.trim() || null,
      notes: this.model.notes?.trim() || null
    });
  }
}
