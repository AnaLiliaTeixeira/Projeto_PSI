import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

import { Game } from '../game';
import { GameService } from '../game.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})



export class SearchComponent implements OnInit {

  searchTerm : string = "";
  games: Game[] = [];
  wasSearched = false;

  constructor(private cookieService: CookieService,private gameService: GameService, private router: Router) {
  }
  getCookie(){
    return this.cookieService.get('login') === 'true';
  }


  ngOnInit() {
    this.wasSearched = false;
    this.searchTerm = this.cookieService.get("search");
    this.searchGamesByName();
  }

  searchGamesByName() {
    this.gameService.searchGamesByName(this.searchTerm)
      .subscribe(games => {
        this.games = games;
        this.wasSearched = true;
      });
  }

  watchDetails(game: Game) {
    this.router.navigate(['/game', game._id]);
  }
}
