import { Platform } from '@angular/cdk/platform';
import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnInit, PlatformRef } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'angular-pwa';
  deferredPrompt: any;
  datas:any = [];
  browser:boolean = false;
  constructor(private http : HttpClient){
  }
  @HostListener('window:beforeinstallprompt', ['$event'])
  onbeforeinstallprompt(e: any) {
    console.log(e);
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    // e.preventDefault();
    // Stash the event so it can be triggered later.
    this.deferredPrompt = e;
    this.browser = true;
  }
  ngOnInit(){
    this.callApi();
  }
  addToHomeScreen() {
    // hide our user interface that shows our A2HS button
    // Show the prompt
    this.deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    this.deferredPrompt.userChoice
      .then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
          this.browser = false;
        } else {
          console.log('User dismissed the A2HS prompt');
        }
        this.deferredPrompt = null;
      });
  }
  remove(){
    document.getElementById('addBtn')?.remove()
  }
  getApi(url:any){
    return this.http.get(url);
  }
  callApi(){
    this.getApi('https://reqres.in/api/users?page=1').subscribe((result:any)=>{
      console.log(result);
      this.datas = result.data;
    })
  }
  loadMore(){
    this.getApi('https://reqres.in/api/users?page=2').subscribe((result:any)=>{
      console.log(result);
      result.data.forEach((ele:any)=>{
        this.datas.push(ele);
      })
    })
  }
}
