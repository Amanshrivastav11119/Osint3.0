import { Component, Inject, } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';  
import { NewsapiService } from '../service/newsapi.service';

@Component({
  selector: 'app-incident-report-dialog',
  templateUrl: './incident-report-dialog.component.html',
})
export class IncidentReportDialogComponent {

  groupsAndKeywords: any[] = [];
  selectedGroup: any;
  newGroupName: string = '';
  newKeywordName: string = '';
  newKeywordSearchEnabled: boolean = true;

  constructor(
    public dialogRef: MatDialogRef<IncidentReportDialogComponent>,
    private newsApiService: NewsapiService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // Load existing groups and keywords when the dialog is opened
    this.loadGroupsAndKeywords();
  }

  loadGroupsAndKeywords() {
    this.newsApiService.getGroupsAndKeywords().subscribe(
      (data) => {
        this.groupsAndKeywords = data;
      },
      (error) => {
        console.error('Error fetching groups and keywords:', error);
      }
    );
  }

  addGroup() {
    if (this.newGroupName.trim() !== '') {
      const newGroup = {
        group_name: this.newGroupName.trim(),
        group_id: Date.now().toString(), // Generating a simple unique ID for the group
        keywords: []
      };
      this.groupsAndKeywords.push(newGroup);
      this.newGroupName = ''; // Clear the input field
    }
  }

  

  deleteGroup(groupId: string) {
    const index = this.groupsAndKeywords.findIndex(group => group.group_id === groupId);
    if (index !== -1) {
      this.groupsAndKeywords.splice(index, 1);
    }
  }

  addKeyword() {
    if (this.selectedGroup && this.newKeywordName.trim() !== '') {
      const newKeyword = {
        searchEnabled: this.newKeywordSearchEnabled,
        word: this.newKeywordName.trim()
      };
      this.selectedGroup.keywords.push(newKeyword);
      this.newKeywordName = ''; // Clear the input field
      this.newKeywordSearchEnabled = true; // Reset the checkbox
    }
  }

  deleteKeyword(groupId: string, keywordIndex: number) {
    const group = this.groupsAndKeywords.find(group => group.group_id === groupId);
    if (group && group.keywords) {
      group.keywords.splice(keywordIndex, 1);
    }
  }

  saveGroupsAndKeywords() {
    this.newsApiService.saveGroupsAndKeywords(this.groupsAndKeywords).subscribe(
      (data) => {
        console.log('Groups and keywords saved successfully:', data);
        this.dialogRef.close(this.groupsAndKeywords); // Close the dialog and pass the updated groups and keywords
      },
      (error) => {
        console.error('Error saving groups and keywords:', error);
      }
    );
  }

  cancel() {
    this.dialogRef.close(); // Close the dialog without saving
  }
}
