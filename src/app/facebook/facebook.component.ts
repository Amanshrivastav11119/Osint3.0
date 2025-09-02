import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ImageModalComponent } from '../image-model/image-modal.component'; // Import the ImageModalComponent
import { FacebookService } from '../service/facebook.service';
import { SharedDataService } from '../service/shared-data.service';

@Component({
  selector: 'app-facebook',
  templateUrl: './facebook.component.html',
  styleUrls: ['./facebook.component.css']
})
export class FacebookComponent implements OnInit {

  searchKeywords: string = '';
  searchResults: any[] = [];
  selectedArticles: any[] = [];
  keywords: any[] = []; // Array to store keywords

  // Search placeholder functions
  isFocused: boolean = false;
  onFocus() {
    this.isFocused = true;
  }
  onBlur() {
    this.isFocused = false;
  }

  // Function to add or remove an article from the selected list
  toggleSelectedArticle(article: any) {
    const index = this.selectedArticles.findIndex(item => item === article);
    if (index !== -1) {
      this.selectedArticles.splice(index, 1);
    } else {
      this.selectedArticles.push(article);
    }
  }
  isArticleSelected(article: any) {
    return this.selectedArticles.includes(article);
  }

  constructor(private facebookService: FacebookService, private sharedDataService: SharedDataService, public dialog: MatDialog) { }

  
  ngOnInit(): void {
    this.sharedDataService.searchQuery$.subscribe(searchQuery => {
      this.searchKeywords = searchQuery;
    });
    this.fetchKeywords();
  }

  // Method to search data based on keywords
  searchData() {
    this.facebookService.searchFacebookData(this.searchKeywords).subscribe((data) => {
      this.searchResults = data;
      // console.log(data);
    });
  }

  // Method to fetch keywords
  fetchKeywords() {
    this.facebookService.fetchKeywords().subscribe((data) => {
      this.keywords = data;
    });
  }

  // Method to update a keyword
  updateKeyword(keywordId: string, newKeyword: string) {
    const keywordData = { search: newKeyword };
    this.facebookService.updateKeyword(keywordId, keywordData).subscribe(() => {
      console.log('Keyword updated successfully');
      // Refresh keywords after update
      this.fetchKeywords();
    });
  }

  // Method to delete a keyword
  deleteKeyword(keywordId: string) {
    this.facebookService.deleteKeyword(keywordId).subscribe(() => {
      console.log('Keyword deleted successfully');
      // Refresh keywords after delete
      this.fetchKeywords();
    });
  }

    // Method to open the modal with image details
    openImageModal(post: any) {
      this.dialog.open(ImageModalComponent, {
        width: '1000px',
        data: { post: post }
      });
    }

}
