import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Storage from '@aws-amplify/storage';
import Predictions, { AmazonAIPredictionsProvider, InterpretTextCategories } from '@aws-amplify/predictions';
import amplify from '../../aws-exports';


@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ImagesComponent implements OnInit {
  public createForm: FormGroup;
  resultMessage = "Pick an image to identify.";
  showResult = false;
  keanuFound = false;
  celebrities = [];

  @ViewChild('fileInput', { static: false })
  fileInput: ElementRef;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.createForm = this.fb.group({
      'file': [''],
    });
  }

  addFile(event) {
    this.showResult = false;
    this.celebrities = [];
    this.resultMessage = "Looking for Keanu..."
    const { target: { files } } = event;
    if (files.length===0) {
      return;
    }
    const file = files[0];
    Predictions.identify({
      entities: {
        source: {
          file,
        },
        celebrityDetection: true
      }
    }).then(result => {
      if (result.entities.length>0) {
        this.celebrities = [];
        let keanuFound = result.entities.filter( (entity) => {
          //@ts-ignore
          const {metadata: {name} = { } } = entity;
          if (name) {
            this.celebrities.push(entity);
          }
          return name == "Keanu Reeves";
        })
        if (keanuFound.length>0) {
          this.showResult = true;
          this.resultMessage = `Yeah! Keanu found!`;
          this.keanuFound = true;
        } else {
          this.showResult = true;
          this.resultMessage = `Nope! Keanu is not here! Keep trying!`;
          this.keanuFound = false;
        }
      } else {
        this.showResult = true;
        this.resultMessage = `Nope! Keanu is not here! Keep trying!`;
        this.keanuFound = false;
      }
    })
    .catch(err => { 
      console.log(err);
      this.resultMessage = "There was an error. Try again later."
    })
    .finally(() => {
      this.fileInput.nativeElement.value = "";
    })
  }

}
