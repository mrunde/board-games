import {Component, Inject} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'confirm-delete-play-dialog',
  standalone: true,
  imports: [MatButton, MatDialogTitle, MatDialogContent, MatDialogActions, TranslatePipe],
  template: `
    <h2 mat-dialog-title>{{ 'play.deleteTitle' | translate }}</h2>

    <mat-dialog-content>
      {{ 'play.deleteConfirmation' | translate:{playedOn: data.playedOn} }}
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button type="button" (click)="cancel()">
        {{ 'common.cancel' | translate }}
      </button>
      <button mat-flat-button color="warn" type="button" (click)="confirm()">
        {{ 'common.delete' | translate }}
      </button>
    </mat-dialog-actions>
  `
})
export class ConfirmDeletePlayDialogComponent {
  constructor(
    private readonly dialogRef: MatDialogRef<ConfirmDeletePlayDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public readonly data: { playedOn: string }
  ) {
  }

  cancel(): void {
    this.dialogRef.close(false);
  }

  confirm(): void {
    this.dialogRef.close(true);
  }
}
