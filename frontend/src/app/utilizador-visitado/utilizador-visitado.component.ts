import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Utilizador } from 'src/app/utilizador';
import { LoginService } from '../login.service';
import { Game } from '../game';
import { Buy } from '../buy';
import { Router } from '@angular/router';
import { LibraryService } from '../library.service';
import { GameService } from '../game.service';
import { FollowersService } from '../followers.service';
import { UtilizadorVisitadoService } from '../utilizador-visitado.service';
import { ActivatedRoute } from '@angular/router';
import { WishlistService } from '../wishlist.service';


@Component({
  selector: 'app-utilizador-visitado',
  templateUrl: './utilizador-visitado.component.html',
  styleUrls: ['./utilizador-visitado.component.css']
})
export class UtilizadorVisitadoComponent {
  user: Utilizador | undefined;
  selectedSection: string = 'info';
  buys: Buy[]  | undefined;
  orderBy: string = 'title';
  orderType: string = 'asc';
  followingList: any[] = [];
  showAllUsers = false;
  wishlist: Game[] = [];
  userList: any[] = []; 
  followersList: Utilizador[] = [];
  
  showUsernameModal: boolean = false;
newUsername: string = "";
errorMessage: string = "";

  

  constructor(private cookieService: CookieService, private followersService: FollowersService, private loginService: LoginService,private libraryService: LibraryService, private router: Router, private wishlistService: WishlistService, 
    ){}
  
  toggleUsersList() {
    this.showAllUsers = !this.showAllUsers;
  }


  getCookie(){
    return this.cookieService.get('login') === 'true';
  }


  ngOnInit(): void {
    const pageUrl = window.location.href;
    const pageSplited = pageUrl.split("/");
    const id = pageSplited[pageSplited.length - 1];
    this.loginService.getLoginUser(id).subscribe((user) => {
      this.user = user;
     
      this.getFollowingList(user?._id);
      this.getFollowersList(user?._id);

  
      this.followersService.getUser(user._id).subscribe((user) => {
        this.user = user;
      });

      this.wishlistService.getWishlistItems(this.user?._id)
        .subscribe((games) => { this.wishlist = games;});
  
      this.followersService.getUsers().subscribe(users => {
        this.userList = users.filter((user) => user._id !== this.user?._id);
      });
    
        this.followingList = this.user?.following ?? [];
    });
    this.libraryService.getUserBuys()
      .subscribe((buys) => {
        this.buys = buys;
      });
    this.followersService.getUsers().subscribe((users) => {
      this.userList = users.filter((user) => user._id !== this.user?._id);       
    });


      
    this.libraryService.getUserBuys().subscribe((buys) => {
      this.buys = buys;
    });
  }
  
  getFollowingList(userId: String) {

    this.followersService.getFollowingList(userId).subscribe((followingList) => {
      this.followingList = followingList;
    });
  }

  getFollowersList(userId: string) {
    this.followersService.getFollowersList(userId).subscribe((followersList) => {
      this.followersList = followersList;
    });
  }

  
  isFollowing(user: Utilizador) {
    if (!this.user) {
      return false;
    }
    return this.followingList.some((followingUser) => followingUser._id === user._id);
  }


  selectOption(option: string) {
    this.selectedSection = option;
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleString('pt-Pt', { 
      year: 'numeric', 
      month: 'numeric', 
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    });
  }

  verDetalhes(id: String) {
    console.log(id);
    this.router.navigate(['/game', id]);
  }


sortGames() {
  if(this.buys){
  if (this.orderBy === 'title') {
    if (this.orderType === 'asc') {
      this.buys.sort((a, b) => a.game.name.localeCompare(b.game.name));
    } else {
      this.buys.sort((a, b) => b.game.name.localeCompare(a.game.name));
    }
  } else {
    if (this.orderType === 'asc') {
      this.buys.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } else {
      this.buys.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
  }
}
}


onSortUp() {
  this.orderType = 'asc';
  this.sortGames();
}


onSortDown() {
  this.orderType = 'desc';
  this.sortGames();
}

onSortChange(event: Event) {
  this.orderBy = (event.target as HTMLSelectElement).value;
  this.sortGames();
}






closeUsernameModal() {
  this.showUsernameModal = false;
}

onSubmit() {
  

  if (!this.newUsername.match(/^[a-zA-Z0-9]*$/)) {
    this.errorMessage = "The username can only contain alphanumeric characters";
    return;
  }

  if (this.newUsername.length < 3) {
    this.errorMessage = "The username must be at least 3 characters long";
    return;
  }
  if (!this.newUsername.match(/^[a-zA-Z0-9]{3,}$/)) {
    this.errorMessage = "The username must be at least 3 alphanumeric characters long";
    return;
  }

  this.followersService.getUsers().subscribe(users => {
    if (users.some(u => u.name === this.newUsername)) {
      this.errorMessage = "The username is already in use by another user.";
      return;
    }

    if (this.user) {
      this.followersService.updateUsername(this.user._id, this.newUsername).subscribe(user => {
        this.user = user;
        this.showUsernameModal = false;
        alert("Username successfully updated!");
      });
    }
  });
}




showProfileImageModal = false;







  closeProfileImageModal() {
  this.showProfileImageModal = false;
  }

  updateWishlist(game: Game) {
    const loggedUser = this.cookieService.get('token');
    this.loginService.getLoginUser(loggedUser).subscribe(
      (u) => { if (this.user) this.wishlistService.updateWishlist(u, game); });
  }

}
