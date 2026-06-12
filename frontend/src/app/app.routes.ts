import {Routes} from '@angular/router';
import {ExpansionPageComponent} from './features/games/pages/expansion-page.component';
import {GamePageComponent} from './features/games/pages/game-page.component';
import {GamesListPageComponent} from './features/games/pages/games-list-page.component';
import {PlaysCalendarPageComponent} from "./features/games/pages/plays-calendar-page.component";

export const routes: Routes = [
  {path: '', component: GamesListPageComponent},
  {path: 'games/:id', component: GamePageComponent},
  {path: 'expansions/:id', component: ExpansionPageComponent},
  {path: 'calendar', component: PlaysCalendarPageComponent}
];
