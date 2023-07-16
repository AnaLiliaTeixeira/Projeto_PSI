import { Component, OnInit } from '@angular/core';
import { Game } from '../game';
import { GameService } from '../game.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})

export class GameComponent {

  game: Game | undefined;
  constructor(private gameService: GameService) {}

  getGameById(id: string): void {
    this.gameService.getGameById(id)
      .subscribe(game => {
        this.game = game;
      });
  }
}