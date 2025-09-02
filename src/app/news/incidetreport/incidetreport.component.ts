import { Component, OnInit } from '@angular/core';
import { NewsapiService } from '../../service/newsapi.service';
import { MatDialog } from '@angular/material/dialog';
import { IncidentReportDialogComponent } from '../../incident-report-dialog/incident-report-dialog.component';
import { saveAs } from 'file-saver';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import * as JSZip from 'jszip';
import { SharedDataService } from '../../service/shared-data.service';


(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-incidetreport',
  templateUrl: './incidetreport.component.html',
  styleUrls: ['./incidetreport.component.css']
})
export class IncidetreportComponent implements OnInit {

  constructor(private api: NewsapiService, public dialog: MatDialog,  private sharedDataService: SharedDataService) { }

  newsData: any;
  selectedLanguage: string;
  incidentData: any = [];
  searchTerm: string = '';
  languages: string[] = [];
  selectedArticles: any[] = [];
  showNoDataMessage: boolean = false;
  selectedKeywords: { keyword: string; group: string }[] = [];

  isFocused: boolean = false;

  onFocus() {
    this.isFocused = true;
  }

  onBlur() {
    this.isFocused = false;
  }

  isArticleSelected(article: any) {
    return this.selectedArticles.includes(article);
  }

  exportNewsAsText(article: any) {
    const exportData = `Title: ${article.title}\n\nContent: ${article.content}\n\n\n`;
    const blob = new Blob([exportData], { type: 'text/plain;charset=utf-8' });
    return new Promise<void>((resolve, reject) => {
      saveAs(blob, `${article.title}.txt`);
      resolve();
    });
  }

  exportAllNewsAsText(searchQuery: string) {
    const zip = new JSZip();
    const promises = [];
    for (const article of this.newsData) {
      const promise = this.exportNewsAsText(article)
        .then(() => {
          const exportData = `Title: ${article.title}\n\nContent: ${article.content}\n\n\n`;
          zip.file(`${article.title}.txt`, exportData);
        });
      promises.push(promise);
    }
    Promise.all(promises).then(() => {
      zip.generateAsync({ type: 'blob' }).then((content) => {
        saveAs(content, `News_${searchQuery}_${new Date().toISOString()}.zip`);
      });
    });
  }

  exportNewsAsPdf(article: any) {
    const documentDefinition = {
      content: [
        { text: `Title: ${article.title}`, fontSize: 16, bold: true },
        { text: `Content: ${article.content}` }
      ]
    };
    return new Promise<void>((resolve, reject) => {
      pdfMake.createPdf(documentDefinition).getBlob((blob) => {
        saveAs(blob, `${article.title}.pdf`);
        resolve();
      });
    });
  }

  exportAllNewsAsPdf(searchQuery: string) {
    const zip = new JSZip();
    const promises = [];
    for (const article of this.newsData) {
      const promise = new Promise<void>((resolve) => {
        const documentDefinition = {
          content: [
            { text: `Title: ${article.title}`, fontSize: 16, bold: true },
            { text: `Content: ${article.content}` }
          ]
        };
        pdfMake.createPdf(documentDefinition).getBlob((blob) => {
          zip.file(`${article.title}.pdf`, blob);
          resolve();
        });
      });
      promises.push(promise);
    }
    Promise.all(promises).then(() => {
      zip.generateAsync({ type: 'blob' }).then((content) => {
        saveAs(content, `News_${searchQuery}_${new Date().toISOString()}.zip`);
      });
    });
  }

  toggleSelectedArticle(article: any) {
    const index = this.newsData.findIndex((item: any) => item === article);
    if (index !== -1) {
      this.newsData.splice(index, 1);
    }
  }

  extractDistinctLanguagesAndCountries() {
    const uniqueLanguages = new Set<string>();
    for (const article of this.incidentData) {
      if (article.language) {
        uniqueLanguages.add(article.language);
      }
    }
    this.languages = Array.from(uniqueLanguages);
  }

  getValue(val: string) {
    this.searchTerm = val;
  }

  ngOnInit(): void {
    this.sharedDataService.searchQuery$.subscribe(searchQuery => {
      // Update the searchQuery property when it changes
      this.searchTerm = searchQuery;
    });
    this.loadSavedNews();
  }

  searchNews() {
    this.api.getNews(this.searchTerm, this.selectedLanguage).subscribe(
      (data) => {
        if (data && data.length > 0) {
          this.newsData = data;
          this.incidentData = data;
          this.extractDistinctLanguagesAndCountries();
        } else {
          this.newsData = [];
        }
      },
      (error) => {
        console.error('Error fetching news data:', error);
      }
    );
  }

  language(optionlang: string) {
    this.selectedLanguage = optionlang;
    // Don't call fetchNewsByKeywords here, let the user initiate it separately
  }

  searchNewsByKeywords(keywords: string[]) {
    this.api.getNewsByKeywords(keywords).subscribe(
      (data) => {
        if (data && data.length > 0) {
          this.newsData = data;
          this.incidentData = data;
          this.extractDistinctLanguagesAndCountries();
        } else {
          this.newsData = [];
        }
      },
      (error) => {
        console.error('Error fetching news data by keywords:', error);
      }
    );
  }

  fetchNewsByKeywords() {
    const keywords = this.selectedKeywords.map(keyword => keyword.keyword);
    this.api.getNews(keywords.join(','), this.selectedLanguage).subscribe(
      (data) => {
        if (data && data.length > 0) {
          this.newsData = data;
          this.incidentData = data;
          this.extractDistinctLanguagesAndCountries();
        } else {
          this.newsData = [];
        }
      },
      (error) => {
        console.error('Error fetching news data:', error);
      }
    );
  }

  loadSavedNews() {
    this.api.getAllNewsFromMongo().subscribe(
      (data) => {
        if (data && data.length > 0) {
          this.newsData = data;
          this.incidentData = data;
          this.extractDistinctLanguagesAndCountries();
        } else {
          this.newsData = [];
        }
      },
      (error) => {
        console.error('Error fetching saved news data:', error);
      }
    );
  }

  toggleSelectedKeyword(keywordObj: { keyword: string; group: string }) {
    const index = this.selectedKeywords.findIndex(k => k.keyword === keywordObj.keyword && k.group === keywordObj.group);
    if (index !== -1) {
      this.selectedKeywords.splice(index, 1);
    } else {
      this.selectedKeywords.push(keywordObj);
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(IncidentReportDialogComponent, {
      width: '1000px',
    });
    dialogRef.afterClosed().subscribe((selectedKeywords: { keyword: string; group: string }[]) => {
      if (selectedKeywords) {
        this.selectedKeywords = selectedKeywords;
        this.fetchNewsByKeywords(); // Call the function when the dialog is closed with selected keywords
      }
    });
  }
}
  