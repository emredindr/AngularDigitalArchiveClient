import { Component, OnInit } from '@angular/core';
import { NavigationService } from '../../services/navigation.service';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss']
})
export class TopNavComponent implements OnInit {
  faCoffee = faCoffee;
  constructor(private navigationService: NavigationService) {}
  ngOnInit() {}
  toggleSideNav() {
      this.navigationService.toggleSideNav();
  }
}
