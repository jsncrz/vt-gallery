import { Route } from "@angular/router";
import { CharacterService } from "shared";
import { CharactersComponent } from "./characters/characters.component";

export const CHARACTERS_ROUTE: Route[] = [{
    path: '',
    providers: [
      CharacterService,
    ],
    children: [
      {path: '', component: CharactersComponent},
    ],
  }];