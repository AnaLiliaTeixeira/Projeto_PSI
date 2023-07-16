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
import { ElementSchemaRegistry } from '@angular/compiler';
import { WishlistService } from '../wishlist.service';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
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

  

  constructor(private cookieService: CookieService, private followersService: FollowersService, private loginService: LoginService,private libraryService: LibraryService, private router: Router, private wishlistService: WishlistService, 
    ){}
  
  toggleUsersList() {
    this.showAllUsers = !this.showAllUsers;
  }


  getCookie(){
    return this.cookieService.get('login') === 'true';
  }


  ngOnInit(): void {
    this.loginService.getLoginUser(this.cookieService.get('token')).subscribe((user) => {
      this.user = user;
     
      this.getFollowingList(user?._id);
      this.getFollowersList(user?._id);

  
      this.followersService.getUser(user._id).subscribe((user) => {
        this.user = user;
      });
  
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

    if (this.user) {
      this.wishlistService.getWishlistItems(this.user?._id)
        .subscribe((games) => { this.wishlist = games;});
    }
      
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

  follow(user: Utilizador) {
    if (!this.user) {
      // usuário não está logado, não pode seguir outros usuários
      return;
    }

    if (this.isFollowing(user)) {
      return;
    }

    if (this.user && user) {
      this.followersService.followUser(this.user._id, user._id).subscribe((result) => {
        console.log(`User ${user.name} followed.`);
        this.followingList.push(user);
        this.followersService.getFollowersList(user._id).subscribe((followersList) => {
          this.followersList = followersList;
          });
      });
    }
  }


  unfollow(user: Utilizador) {
    if (!this.user) {
      // usuário não está logado, não pode deixar de seguir outros usuários
      return;
    }
    const index = this.followingList.findIndex((followingUser) => followingUser._id === user._id);
    if (index >= 0) {
      this.followingList.splice(index, 1);
      if (this.user && user) {
        this.followersService.unfollowUser(this.user._id, user._id).subscribe((result) => {
          console.log(`User ${user.name} unfollowed.`);
          this.followersService.getFollowersList(user._id).subscribe((followersList) => {
            this.followersList = followersList;
            });
        });
        
      }
    }
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


//EDITAR USERNAME
showUsernameModal: boolean = false;
newUsername: string = "";
errorMessage: string = "";

editUsername() {
  this.newUsername = "";
  this.errorMessage = "";
  this.showUsernameModal = true;
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


//EDITAR FOTO DE PERFIL

showProfileImageModal = false;


editProfileImage() {
  this.showProfileImageModal = true;
}

selectProfileImage(imageUrl: string) {
  if (this.user) {
    this.followersService.updateProfileImage(this.user._id, imageUrl).subscribe({
      next: () => {
        if (this.user) {
          this.user.imageProfile = imageUrl;
          this.showProfileImageModal = false;
          alert("Profile Picture Updated Successfully!");
        }
      },
      error: error => console.log(error)
    });
  }
  setTimeout(() => {
    location.reload();
  }, 500);
}


  closeProfileImageModal() {
  this.showProfileImageModal = false;
  }


}

  
