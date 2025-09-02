import { Component, OnInit } from '@angular/core';
import { WikiService } from '../service/wikipedia.service';
import { SharedDataService } from '../service/shared-data.service'; 

@Component({
  selector: 'app-wikipedia',
  templateUrl: './wikipedia.component.html',
  styleUrls: ['./wikipedia.component.css']
})
export class WikipediaComponent implements OnInit {

  searchTerm: any;
  results: any = [];
  totalResults: any;
  page: number = 1;

  constructor(private wiki: WikiService,  private sharedDataService: SharedDataService) { }

  //placeholder functions
  isFocused: boolean = false;
  onFocus() {
    this.isFocused = true;
  }
  onBlur() {
    this.isFocused = false;
  }

  ngOnInit(): void {
    this.sharedDataService.searchQuery$.subscribe(searchQuery => {
      // Update the searchQuery property when it changes
      this.searchTerm = searchQuery;
    });
    throw new Error('Method not implemented.');

  }

  //wikipedia api results
  onSubmit() {
    this.wiki.search(this.searchTerm).subscribe((res: any) => {
      this.results = res.query.search;
      this.totalResults = res.query.search.length;
      console.log(this.results);
    });
  }

}
