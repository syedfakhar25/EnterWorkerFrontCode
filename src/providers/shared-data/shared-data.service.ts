
import { Injectable, ApplicationRef, NgZone, OnInit } from '@angular/core';
import { ConfigService } from '../config/config.service';


import { HttpClient } from '@angular/common/http';





import { NavigationExtras, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { FeedService } from 'src/app/feed.service';
import { ToasterService } from '../toastr-sevice/toaster.service';


@Injectable()
export class SharedDataService implements OnInit{

  authenticationState = new BehaviorSubject(false);
  public banners = [];
  public tab1 = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  public tab2 = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  public tab3 = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  public flashSaleProducts = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  public allCategories: any = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  public categories: any = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  public subCategories: any = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  public customerData: { [k: string]: any } = {};
  public designID = 36;
  public recentViewedProducts = new Array();
  public cartProducts = new Array();
  public privacyPolicy = "";
  public termServices = "";
  public refundPolicy = "";
  public aboutUs = "";
  public cartquantity = 0;
  public wishList = new Array();
  public tempdata: { [k: string]: any } = {};
  public dir = "ltr";
  public selectedFooterPage = "HomePage";
  public currentOpenedModel: any = null;
  public applieddesign = new Array;
  public Languageflag: { [k: string]: any } = {}
  public token:any;
  //
  public currentPage="";
  //
  public orderDetails = {
    guest_status: 0,
    email: "",
    tax_zone_id: "",
    delivery_firstname: "",
    delivery_lastname: "",
    delivery_state: "",
    delivery_city: "",
    delivery_postcode: "",
    delivery_zone: "",
    delivery_country: "",
    delivery_country_id: "",
    delivery_street_address: "",
    delivery_country_code: "",
    delivery_phone: "",

    billing_firstname: "",
    billing_lastname: "",
    billing_state: "",
    billing_city: "",
    billing_postcode: "",
    billing_zone: "",
    billing_country: "",
    billing_country_id: "",
    billing_street_address: "",
    billing_country_code: "",
    billing_phone: "",
    total_tax: '',
    shipping_cost: '',
    shipping_method: '',
    payment_method: '',
    comments: ''
  };
  public translationListArray = [];
  public singleProductPageData = [];
  public singlePostData: any;
  myOrderDetialPageData: any;
  lab = false;
  public missingValues = [];
  primaryHexColor = "#3980ff";


  role:any;
  initial=0;
  constructor(
    public config: ConfigService,
    public httpClient: HttpClient,
    
   public feedService:FeedService,
   private toast:ToasterService,
    
    public router:Router,
  ) {
    // let users = [];

    // if(localStorage.getItem('Users')){
    //   users = JSON.parse(localStorage.getItem('Users')||'{}');
    //   console.log(users);
    //   this.customerData = users[0];
    //   console.log(this.customerData);
    //   this.authenticationState.next(true);
    // }
    // else{
    //   this.authenticationState.next(false);
    // console.log('No User');

    let users = [];
  
     

    if(localStorage.getItem('Users')){
      users = JSON.parse(localStorage.getItem('Users')||'{}');
      
      this.customerData = users[0];
      // console.log(this.customerData);
      
    }


    else if(localStorage.getItem('Users') == null){
    //  console.log('no users exist')
     
    }
    

    if(localStorage.getItem('Tks')){
      this.token = JSON.parse(localStorage.getItem('Tks')||'{}');
       console.log(this.token)
       
     }
     
      if(localStorage.getItem('Tks') == null){
        // console.log('no tokens exist');
       
     }

     if(this.customerData.user_type == '1'){
      this.role = 'admin'
      
    }
    if(this.customerData.user_type == '2'){
     this.role = 'project manager'
     
   }
   if(this.customerData.user_type == '3'){
     this.role = 'employee'
     
   }
   if(this.customerData.user_type == '4'){
     this.role = 'customer'
     
   }

   if(this.customerData.user_type == '5'){
    this.role = 'company worker'
    
  }
  
   

    if(localStorage.getItem('Language')){
      this.Languageflag = JSON.parse(localStorage.getItem('Language')||'{}');
     
      //  console.log(this.Languageflag)
     }
     else{
       this.Languageflag.flag = 'https://www.countryflags.io/us/flat/32.png'
     }

    
     

  }

  ngOnInit() {

   

  }
  

  IsLoggedIn(){
    console.log('ye chala')
   
  }
 
  //adding into recent array products
 

  login(data:any) {
    
    
 
  
   this.customerData = data.user;
    
   
   console.log(this.customerData)
   //  this.addUser(this.customerData);
 
 
     this.addUserToken(data.token)
      this.addUser(this.customerData);
   
 
   
   return;
    
     
     //window.location.reload()
  }

  
  addUserToken(token:any){
    console.log('yahan aya');
    console.log(token);
    let tokens = [];
    if(localStorage.getItem('Tks')){
      tokens = JSON.parse(localStorage.getItem('Tks')||'{}');
      tokens= [token, ...tokens];
    }
    else{
      tokens = [token];
      localStorage.setItem('Tks',JSON.stringify(tokens));
    }
  }
  addUser(user:any){
    console.log('User in shared',user);
    let users = [];
    if(localStorage.getItem('Users')){
      users = JSON.parse(localStorage.getItem('Users')||'{}');
      users = [user, ...users];
    }
    else{
      users = [user];
      console.log('this is array',users);
      console.log('this is only',user);
      localStorage.setItem('Users',JSON.stringify(users));
    }
    
  }

  // addUser(user:any){
  //   let users = [];
  //   if(localStorage.getItem('Users')){
  //     users = JSON.parse(localStorage.getItem('Users')||'{}');
  //     users = [user, ...users];
  //   }
  //   else{
  //     users = [user];
  //     localStorage.setItem('Users',JSON.stringify(users));
  //   }
    
  // }

  setLanguage(language:any){
    let languages;
    if(localStorage.getItem('Language')){
      languages = JSON.parse(localStorage.getItem('Language')||'{}');
      languages = language;

    }
    else{
      languages = language;
      localStorage.setItem('Language',JSON.stringify(languages));
    }
  }

  setCurrentPage(page:any){
    let pages;
    if(localStorage.getItem('Page')){
      pages = JSON.parse(localStorage.getItem('Page')||'{}');
      pages = page;

    }
    else{
      pages = page;
      localStorage.setItem('Page',JSON.stringify(pages));
    }
  }

  logOut() {
  

   localStorage.removeItem('Users');

  
   localStorage.removeItem('Tks');
   this.router.navigate(['']);
    window.location.reload()
  
  return;
  // this.admob.ShowBanner();
  
    // this.fb.logout();
   
  }
 


  showAd() {
    //this.loading.autoHide(2000);
    //this.appEventsService.publish('showAd', "");
  }

  // toast(msg:any) {
  //   console.log(msg);
  //   this.translateString(msg).then(async (res: string) => {
  //     const toast = await this.toastCtrl.create({
  //       message: res,
  //       duration: 3500,
  //       position: 'bottom',
     
  //     });
  //     toast.present();
  //   });
  // }
  // toastMiddle(msg) {

  //   this.translateString(msg).then(async (res: string) => {
  //     let toast = await this.toastCtrl.create({
  //       message: res,
  //       duration: 3500,
  //       position: 'middle'
  //     });

  //     toast.present();
  //   });
  // }

  // toastWithCloseButton(msg) {

  //   this.translateString(msg).then(async (res: string) => {
  //     let toast = await this.toastCtrl.create({
  //       message: res,
  //       keyboardClose: true,
  //       position: 'middle',
  //       //text: "X"
  //     });
  //     toast.present();
  //   });
  // }


  //categories page

  // getCategoriesPageItems(parent) {
  //   let c = [];
  //   if (parent == undefined)
  //     c = this.categories;
  //   else {
  //     for (let v of this.allCategories) {
  //       if (v.parent == parent) {
  //         c.push(v);
  //       }
  //     }
  //   }
  //   return c;
  // }

  // translation services
  // translateString(value) {
  //   return new Promise(resolve => {
  //     let v = this.translationListArray[value];
  //     console.log(v);
  //     if (v == undefined) {
  //       this.missingValues[value] = value;
  //       v = value;
  //     }
  //     resolve(v);
  //   });
  // }
  // translateArray(value) {
  //   return new Promise(resolve => {
  //     let tempArray = [];
  //     value.forEach(element => {
  //       if (this.translationListArray[element] != undefined) {
  //         tempArray[element] = this.translationListArray[element];

  //       }
  //       else {
  //         tempArray[element] = element;
  //         this.missingValues[value] = value;
  //       }
  //     });
  //     resolve(tempArray);
  //   });
  // }
  //=================================================

  // showAlert(text) {
  //   this.translateArray([text, "ok", "Alert"]).then(async (res) => {
  //     console.log(res);
  //     const alert = await this.alertCtrl.create({
  //       header: res["Alert"],
  //       message: res[text],
  //       buttons: [res["ok"]]
  //     });
  //     await alert.present();
  //   });
  // }

  // showAlertWithTitle(text, title) {
  //   this.translateArray([text, "ok", title]).then(async (res) => {
  //     let alert = await this.alertCtrl.create({
  //       header: res[title],
  //       message: res[text],
  //       buttons: [res["ok"]]
  //     });
  //     await alert.present();
  //   });
  // }

  // getNameFirstLetter() {
  //   return this.customerData.firstName.charAt(0);
  // }

  // getNameFirstLetters(){
  //   let nam:string = this.customerData.customers_firstname
  //   let nam1:string = this.customerData.customers_lastname;
  //   let nam2:string = nam.charAt(0);
  //   let nam3:string = nam1.charAt(0);
  //   let nam4:string = nam2 + nam3;
   
  //   let namPicture = nam4.toString();
  //   return namPicture;
  // }

  // getProductRatingPercentage(rating: any) {
  //   let val = (parseFloat(rating) * 100) / 5;
  //   return val + '%'
  // }

}
