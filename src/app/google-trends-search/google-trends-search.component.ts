import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GoogleTrendsSearchService } from '../service/google-trends-search.service';

@Component({
  selector: 'app-google-trends-search',
  templateUrl: './google-trends-search.component.html',
  styleUrls: ['./google-trends-search.component.css'],
})
export class GoogleTrendsSearchComponent implements OnInit {

  constructor(
    private googleTrendsService: GoogleTrendsSearchService,
    private formBuilder: FormBuilder
  ) {
    this.searchForm = this.formBuilder.group({
      query: [''],
      dataTypes: [''],
    });
  }

  googleTrendsData: any;
  searchForm: FormGroup;
  isFocused: boolean = false;
  currentDataType: string = '';

  onFocus() {
    this.isFocused = true;
  }

  onBlur() {
    this.isFocused = false;
  }

  ngOnInit(): void {
    // Additional initialization logic if needed
  }

  getGoogleTrendsData(): void {
    const { query, dataTypes } = this.searchForm.value;
    this.googleTrendsService.getGoogleTrendsData(query, dataTypes).subscribe(
      (data) => {
        this.googleTrendsData = data;
        console.log(this.googleTrendsData);

      },
      (error) => {
        console.error('Error fetching Google Trends data:', error);
      }
    );
  }

  onChangeDataTypes(selectedDataType: string): void {
    const currentDataTypes = this.searchForm.get('dataTypes')?.value || [];
    const isSelected = currentDataTypes.includes(selectedDataType);
    const newDataTypes = isSelected
      ? currentDataTypes.filter((type: string) => type !== selectedDataType)
      : [selectedDataType];

    this.searchForm.patchValue({ dataTypes: newDataTypes });
    this.currentDataType = isSelected ? '' : selectedDataType;
  }

  getValueForQuery(region: any, query: string): string {
    const matchingValue = region.values.find((value: { query: string, value: string }) => value.query === query);
    return matchingValue ? matchingValue.value : 'N/A';
  }

  getSearchQueries(): string[] {
    return this.googleTrendsData[0].data.search_parameters.q.split(',').map((q: string) => q.trim());
  }
  



}
