import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as _ from 'lodash';
import * as io from 'socket.io-client';
import { UserService } from 'src/app/services/user.service';
import { TokenService } from 'src/app/services/token.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-people',
  templateUrl: './people.page.html',
  styleUrls: ['./people.page.scss'],
})
export class PeoplePage implements OnInit {
  customStyle: string = environment.scrollbarStyle;
  users = [];
  loggedInUser: any;
  userFollowing = [];
  socket: any;
  onlineUsers = [];
  constructor(private userService: UserService, private tokenService: TokenService, private router: Router) {
    this.socket = io('http://localhost:3000');
  }

  ngOnInit() {
    this.tokenService.getPayload().then(user => {
      this.loggedInUser = user;
      this.getUsers();
      this.getUser();
      this.socket.on('reloadPage', () => {
        this.getUser();
      });
    })

  }

  getUsers() {
    this.userService.getAllUsers().subscribe(
      data => {
        _.remove(data.result, { username: this.loggedInUser.username });
        this.users = data.result;
      }
    )
  }

  getUser() {
    this.userService.getUser(this.loggedInUser._id).subscribe(
      data => {
        this.userFollowing = data.result.following;
      }
    )
  }

  followUser(user) {
    this.userService.followUser(user._id).subscribe(
      data => {
        this.socket.emit('reload', {});
      }
    )
  }

  unFollowUser(user) {
    this.userService.unFollowUser(user._id).subscribe(
      data => {
        this.socket.emit('reload', {});
      }
    )
  }

  isFollowed(arr, id) {
    const result = _.find(arr, ['userFollowed._id', id]);
    if (result) {
      return true
    } else return false;
  }
  online(event) {
    this.onlineUsers = event;
  }

  checkIfOnline(id) {
    const result = _.indexOf(this.onlineUsers, id);
    if (result > -1) {
      return true;
    } else {
      return false;
    }
  }

  viewProfile(user) {
    this.router.navigate(['tabs/view-profile', user._id]);
  }

}
