import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LiveseachComponent } from './news/livesearch/liveseach.component';
import { IncidetreportComponent } from './news/incidetreport/incidetreport.component';
import { YouTubeSearchComponent } from './youtube/youtube.component';
import { FlickrComponent } from './flickr/flickr.component';
import { WikipediaComponent } from './wikipedia/wikipedia.component';
import { GoogleSearchComponent } from './google/google.component';
import { TelegramComponent } from './telegram/telegram.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GlobalsearchComponent } from './globalsearch/globalsearch.component';
import { LoginComponent } from './login/login.component';
import { FacebookComponent } from './facebook/facebook.component';
import { ElibraryComponent } from './elibrary/elibrary.component';
// import { RegisterComponent } from './register/register.component';
// import { authGuard } from './guard/auth.guard';
import { ImageSearchComponent } from './image-search/image-search.component';
import { GoogleTrendsSearchComponent } from './google-trends-search/google-trends-search.component';
import { WhoisComponent } from './whois/whois.component';
import { LinkedinComponent } from './linkedin/linkedin.component';
import { BlockchainComponent } from './blockchain/blockchain.component';
import { SignupComponent } from './signup/signup.component';
const routes: Routes = [
   //Routes for components

  { path: 'login', component: LoginComponent },
  {path: 'signup', component: SignupComponent},
  { path: '', redirectTo: 'globalsearch', pathMatch: 'full' },
  { path: 'livesearch', component: LiveseachComponent },
  // { path: 'incidentreport', component: IncidetreportComponent },
  { path: 'youtube', component: YouTubeSearchComponent },
  { path: 'flickr', component: FlickrComponent },
  { path: 'wikipedia', component: WikipediaComponent },
  { path: 'google', component: GoogleSearchComponent },
  { path: 'youtube', component: YouTubeSearchComponent},
  { path: 'wikipedia', component: WikipediaComponent},
  { path: 'google', component: GoogleSearchComponent},
  // { path: 'telegram', component: TelegramComponent },
  { path: 'dashboard', component: DashboardComponent  },
  { path: 'globalsearch', component: GlobalsearchComponent },
  // { path: 'facebook', component: FacebookComponent },
  // { path: 'elibrary', component: ElibraryComponent },
  { path: 'image-search', component: ImageSearchComponent },
  { path: 'googletrend', component: GoogleTrendsSearchComponent },
  { path: 'whois', component: WhoisComponent },
  { path: 'linkedin', component: LinkedinComponent },
  { path: 'blockchain', component: BlockchainComponent },

];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [ ],
})
export class AppRoutingModule { }
