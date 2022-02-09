import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {


  constructor(public shared:SharedDataService,public router:Router){

  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
    ):boolean {
      if(this.shared.token == undefined){
        this.router.navigate(['login'])
        return false;
      }
      return true
    
    
  }
  
}
