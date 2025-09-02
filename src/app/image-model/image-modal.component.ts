import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-image-modal',
  templateUrl: './image-modal.component.html',
  styleUrls: ['./image-modal.component.css']
})
export class ImageModalComponent {

  currentImageIndex = 0;
  currentImage: string;

  constructor(
    public dialogRef: MatDialogRef<ImageModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.loadCurrentImage();
    // console.log(data);
  }

  loadCurrentImage() {
    if (this.data.post.imagehash.length > 0) {
      this.currentImage = this.data.post.imagehash[this.currentImageIndex];
    }
  }

  nextImage() {
    if (this.currentImageIndex < this.data.post.imagehash.length - 1) {
      this.currentImageIndex++;
      this.loadCurrentImage();
    }
  }

  prevImage() {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
      this.loadCurrentImage();
    }
  }
 

  closeDialog(): void {
    this.dialogRef.close();
  }
}
