import {Routes} from '@angular/router';
import {ExpansionDetailComponent} from './features/games/pages/expansion-detail.component';
import {GameDetailComponent} from './features/games/pages/game-detail.component';
import {GamesListComponent} from './features/games/pages/games-list.component';

export const routes: Routes = [
  {path: '', component: GamesListComponent},
  {path: 'games/:id', component: GameDetailComponent},
  {path: 'expansions/:id', component: ExpansionDetailComponent}
];
