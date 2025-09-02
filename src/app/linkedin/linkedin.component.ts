import { Component } from '@angular/core';
import { LinkedinService } from '../service/linkedin.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-linkedin',
  templateUrl: './linkedin.component.html',
  styleUrls: ['./linkedin.component.css']
})
export class LinkedinComponent {

  query: string;
  searchType: string = 'person';
  connectionCountInput: string;
  extractUrl: string;
  searchResultsWithConnectionCount: any;
  extractedProfile: any;
  selectedSearchType: string;
  searchResults: any[];
  companyDetails: any; // Adjust the type based on the actual structure of the response
  username: string = ''; // You might want to initialize your username property

  // Search placeholder functions
  isFocused: boolean = false;
  onFocus() {
    this.isFocused = true;
  }
  onBlur() {
    this.isFocused = false;
  }

  constructor(private linkedinService: LinkedinService) { }

  // Reset search input and results when a new option is selected
  resetSearch(): void {
    this.query = '';
    this.extractUrl = '';
    this.connectionCountInput = '';
    this.connectionCountInput = '';
    this.searchResultsWithConnectionCount = null;
    this.extractedProfile = null;
    this.searchResults = [];
  }

  search(): void {
    this.searchResults = []; // Reset search results
    if (this.selectedSearchType === 'search') {
      this.performSearch();
    } else if (this.selectedSearchType === 'profileExtractor') {
      this.extract();
    } else if (this.selectedSearchType === 'connectionCount') {
      this.searchWithConnectionCount();
    } else if (this.selectedSearchType === 'companyDetails') {
      this.fetchCompanyDetails();
    }
  }

  // Profile search and company
  performSearch(): void {
    this.linkedinService.search(this.query).subscribe(
      (data) => {
        this.searchResults = data.data;
        console.log(data.data);
        console.log(this.searchResults);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  // Profile extractor
  extract(): void {
    if (this.extractUrl) {
      this.linkedinService.extract(this.extractUrl).subscribe(
        (data) => {
          this.extractedProfile = data;
          console.log(data);
        },
        (error) => {
          console.error(error);
        }
      );
    } else {
      console.error('LinkedIn profile URL is not provided.');
    }
  }

  // Connection count
  searchWithConnectionCount(): void {
    console.log('Calling searchWithConnectionCount with username:', this.connectionCountInput);

    this.linkedinService.getConnectionCount(this.connectionCountInput).subscribe(
      (data) => {
        console.log('Connection Count API Response:', data);
        this.searchResultsWithConnectionCount = data;
      },
      (error) => {
        console.error('Error calling Connection Count API:', error);
      }
    );
  }

  // Company details
  fetchCompanyDetails() {
    const username = this.username; // You can replace 'ibm' with the desired username
    this.linkedinService.getCompanyDetails(username).subscribe(
      (data) => {
        this.searchResults = data.data;
        console.log('Company Details Response:', this.searchResults);
        console.log(this.searchResults[0].website);
        // Handle the company details data
      },
      (error) => {
        console.error('Error fetching company details:', error);
        // Handle the error
      }
    );
  }

  getTitleForSearchType(): string {
    return this.selectedSearchType === 'connectionCount' ? 'Connection Count Results' : 'Profile Extractor Results';
  }

  getResultsForSearchType(): any[] {
    return this.selectedSearchType === 'connectionCount' ? this.searchResultsWithConnectionCount : this.extractedProfile;
  }
}
