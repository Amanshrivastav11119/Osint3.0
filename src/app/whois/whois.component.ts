import { Component, OnInit } from '@angular/core';
import { WhoisService } from '../service/whois.service';
import { SharedDataService } from '../service/shared-data.service'; 

@Component({
  selector: 'app-who-is',
  templateUrl: './whois.component.html',
  styleUrls: ['./whois.component.css']
})
export class WhoisComponent implements OnInit{

  domain: string;
  whoisData: any;
  nslookupData: any;
  selectedSearchType: string = 'whois'; // Default to 'whois'

  // Search placeholder functions
  isFocused: boolean = false;
  onFocus() {
    this.isFocused = true;
  }
  onBlur() {
    this.isFocused = false;
  } 

  constructor(private whoisService: WhoisService,  private sharedDataService: SharedDataService) { }

  ngOnInit(): void {
    this.sharedDataService.searchQuery$.subscribe(searchQuery => {
      // Update the searchQuery property when it changes
      this.domain = searchQuery;
    }); 
    throw new Error('Method not implemented.');
  }

  search() {
    if (this.selectedSearchType === 'whois') {
      this.searchWhois();
    } else if (this.selectedSearchType === 'nslookup') {
      this.searchNslookup();
    }
  }

  searchWhois() {
    this.whoisService.getWhoisData(this.domain).subscribe(
      data => {
        this.whoisData = data;
        console.log('Whois Data:', this.whoisData);
      },
      error => {
        console.error('Error fetching Whois data:', error);
      }
    );
  }

  searchNslookup() {
    this.whoisService.nslookup(this.domain).subscribe(
      data => {
        this.nslookupData = data;
        console.log('Nslookup Data:', this.nslookupData);
      },
      error => {
        console.error('Error fetching Nslookup data:', error);
      }
    );
  }
}
