import {Routes} from '@angular/router';
import {GamesListComponent} from './features/games/pages/games-list.component';
import {GameDetailComponent} from './features/games/pages/game-detail.component';
import {
  ExpansionDetailComponent
} from './features/games/pages/expansion-detail.component';

export const routes: Routes = [
  {path: '', component: GamesListComponent},
  {path: 'games/:id', component: GameDetailComponent},
  {path: 'expansions/:id', component: ExpansionDetailComponent}
];
