import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Storage from '@aws-amplify/storage';
import Predictions, { AmazonAIPredictionsProvider, InterpretTextCategories } from '@aws-amplify/predictions';
import amplify from '../../aws-exports';

Predictions.addPluggable(new AmazonAIPredictionsProvider());

@Component({
  selector: 'text-root',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.css']
})
export class TextComponent implements OnInit {
 REKOGNITION_LANGUAGES = [ 
    { id: "ar", name: "Arabic" }, 
    { id: "zh", name: "Chinese (Simplified)" },
    { id: "zh-TW", name: "Chinese (Traditional)" },
    { id: "cs", name: "Czech" },
    { id: "da", name: "Danish" },
    { id: "nl", name: "Dutch" },
    { id: "en", name: "English" },
    { id: "fi", name: "Finnish" },
    { id: "fr", name: "French" },
    { id: "de", name: "German" },
    { id: "he", name: "Hebrew" },
    { id: "hi", name: "Hindi" },
    { id: "id", name: "Indonesian" },
    { id: "it", name: "Italian" },
    { id: "ja", name: "Japanese" },
    { id: "ko", name: "Korean" },
    { id: "ms", name: "Malay" },
    { id: "no", name: "Norwegian" },
    { id: "fa", name: "Persian" },
    { id: "pl", name: "Polish" },
    { id: "pt", name: "Portuguese" },
    { id: "ru", name: "Russian" },
    { id: "es", name: "Spanish" },
    { id: "sv", name: "Swedish" },
    { id: "tr", name: "Turkish" },
   ];
   
   POLLY_LANGUAGES = [ 
    { id: "xx-xx", name: "Select", voices: ["Select"]},
    { id: "arb", name: "Arabic", voices: ["Zeina (female)"] }, 
    { id: "cmn-CN", name: "Chinese, Mandarin", voices: ["Zhiyu (female)"] },
    { id: "da-DK", name: "Danish", voices: ["Naja (female)", "Mads (male)"] },
    { id: "nl-NL", name: "Dutch", voices: ["Lotte (female)", "Ruben (male)"] },
    { id: "en-AU", name: "English, Australian", voices: ["Nicole (female)", "Russell (male)"] },
    { id: "en-GB", name: "English, British", voices: ["Amy (female)", "Emma (female)", "Brian (male)"] },
    { id: "en-IN", name: "English, Indian", voices: ["Aditi (female)", "Raveena (female)"] },
    { id: "en-US", name: "English, US", voices: ["Ivy (female)", "Joanna (female)", "Kendra (female)", "Kimberly (female)", "Salli (female)", "Joey (male)", "Justin (male)", "Matthew (male)"] },
    { id: "en-GB-WLS", name: "English, Welsh", voices: ["Geraint (male)"] },
    { id: "fr-FR", name: "French", voices: ["Celine (female)", "Mathieu (male)"] },
    { id: "fr-CA", name: "French, Canadian", voices: ["Chantal (female)"] },
    { id: "hi-IN", name: "Hindi", voices: ["Aditi (female)"] },
    { id: "de-DE", name: "German", voices: ["Marlene (female)", "Vicki (female)", "Hans (male)"] },
    { id: "is-IS", name: "Icelandic", voices: ["Dora (female)", "Karl (male)"] },
    { id: "it-IT", name: "Italian", voices: ["Carla (female)", "Bianca (female)", "Giorgio (male)"] },
    { id: "ja-JP", name: "Japanese", voices: ["Mizuki (female)", "Takumi (male)"] },
    { id: "ko-KR", name: "Korean", voices: ["Seoyeon (female)"]},
    { id: "nb-NO", name: "Norwegian", voices: ["Liv (female)"] },
    { id: "pl-PL", name: "Polish", voices: ["Ewa (female)", "Maja (female)", "Jacek (male)", "Jan (male)"] },
    { id: "pt-BR", name: "Portuguese, Brazilian", voices: ["Vitoria (female)", "Ricardo (male)"] },
    { id: "pt-PT", name: "Portuguese, European", voices: ["Ines (female)", "Cristiano (male)"] },
    { id: "ro-RO", name: "Romanian", voices: ["Carmen (female)"] },
    { id: "ru-RU", name: "Russian", voices: ["Tatyana (female)", "Maxim (male)"] },
    { id: "es-ES", name: "Spanish, European", voices: ["Conchita (female)", "Lucia (female)", "Enrique (male)"] },
    { id: "es-MX", name: "Spanish, Mexican", voices: ["Mia (female)"] },
    { id: "es-US", name: "Spanish, US", voices: ["Penelope (female)", "Miguel (male)"] },
    { id: "sv-SE", name: "Swedish", voices: ["Astrid (female)"] },
    { id: "tr-TR", name: "Turkish", voices: ["Filiz (female)"] },
    { id: "cy-GB", name: "Welsh", voices: ["Gwyneth (female)"] },
   ];

  PLAYRATE_VALUES = [
    // { id:  -1, name: "Backwards" },  // not supported
    { id: 0.5, name: "Slow" },
    { id:   1, name: "Normal" },
    { id:   2, name: "Fast" },
  ];
  
  title = 'amplify-ml-app';
  public createForm: FormGroup;

  sourceLanguages = this.REKOGNITION_LANGUAGES;
  selectedSource = this.REKOGNITION_LANGUAGES.find(x => x.id == amplify.predictions.convert.translateText.defaults.sourceLanguage);
  
  targetLanguages = this.REKOGNITION_LANGUAGES;
  selectedTarget = this.REKOGNITION_LANGUAGES.find(x => x.id == amplify.predictions.convert.translateText.defaults.targetLanguage);

  translation1: string = "";
  disabledInput: boolean = false;
  disabledDetect: boolean = false;
  detectedClass = { "detected": false, "not-available": false };

  speechLanguages = this.POLLY_LANGUAGES;
  selectedSpeech = this.POLLY_LANGUAGES.find(x => x.id == amplify.predictions.convert.speechGenerator.defaults.LanguageCode);
  voicesList;
  selectedVoice;
  disableSpeech = false;
  audio = new Audio(); 
  enableStop = false;

  speedsList = this.PLAYRATE_VALUES;
  selectedSpeed = 1;

  constructor(private fb: FormBuilder) { }
  
  ngOnInit() {
    this.createForm = this.fb.group({
      'translateField': ['My sastre es rico!'],
      'sourceLanguage': [this.selectedSource],
      'targetLanguage': [this.selectedTarget],
      'speechField': ['My taylor is rich.'],
      'speechLanguage': [this.selectedSpeech],
      'voice': [this.selectedVoice],
      'speed': [this.selectedSpeed],
    });

    this.selectDefaultVoice();
    this.audio.defaultPlaybackRate = this.selectedSpeed;
  }

  translate() {
    let textToTranslate = this.createForm.controls.translateField.value;
    this.translation1 += "...";
    this.disabledInput = true;
    Predictions.convert({
      translateText: {
        source: {
          text: textToTranslate,
          language: this.selectedSource.id // defaults configured on aws-exports.js
          // supported languages https://docs.aws.amazon.com/translate/latest/dg/how-it-works.html#how-it-works-language-codes
        },
        targetLanguage: this.selectedTarget.id
      }
    })
    .then(({text}) => {
      this.translation1 = text;
    })
    .catch(err => {
      this.translation1 = "";
    })
    .finally(() => {
      this.disabledInput = false;
      this.resetDetect(false, false);
    })
  }

  onChange(deviceValue) {
    this.resetDetect(false, false);
  }

  resetDetect(f1, f2) {
    this.detectedClass = { "detected": f1, "not-available": f2 };
  }

  detectLanguage() {
    let textToInterpret = this.createForm.controls.translateField.value;
    this.disabledDetect = true;
    Predictions.interpret({
      text: {
        source: {
          text: textToInterpret,
        },
        type: InterpretTextCategories.LANGUAGE
      }
    })
    .then((result) => {
      let detected = result.textInterpretation.language;
      let available = this.REKOGNITION_LANGUAGES.find(x => x.id == detected);
      if (available) {
        this.selectedSource = this.REKOGNITION_LANGUAGES.find(x => x.id == detected);
        this.resetDetect(true, false);
        console.log(`Language detected: ${detected}`)
      } else {
        this.resetDetect(false, true);
        console.log(`Language detected: ${detected}. Language still not available for translations.`)
      }
    })
    .catch(err => {
      this.translation1 = "";
    })
    .finally(() => {
      this.disabledDetect = false;
    })
  }

  textToSpeech() {
    let textToTranslate = this.createForm.controls.speechField.value;
    let voiceId = this.selectedVoice.split(" ")[0];
    Predictions.convert({
      textToSpeech: {
        source: {
          text: textToTranslate,
        },
        voiceId: voiceId // default configured on aws-exports.js 
        // list of different options are here https://docs.aws.amazon.com/polly/latest/dg/voicelist.html
      }
    })
    .then((result) => {
      if (result.speech.url) {
        this.enableStop = true;
        this.audio.src = result.speech.url;
        this.audio.playbackRate = this.selectedSpeed;
        this.audio.play();
        this.audio.onended = () => {
          this.enableStop = false;
        };
      }
    })
  }

  stop() {
    this.audio.pause();
    this.audio.currentTime = 0;
    this.enableStop = false;
  }

  selectDefaultVoice() {
    let selectedSpeech = this.selectedSpeech;
    if (selectedSpeech) {
      // find partial match of default voice
      let defaultVoice = amplify.predictions.convert.speechGenerator.defaults.VoiceId;
      let voiceIndex = selectedSpeech.voices.findIndex(element => element.includes(defaultVoice))
      // set in select
      this.voicesList = selectedSpeech.voices;
      this.selectedVoice = selectedSpeech.voices[voiceIndex];
    }
  }

  onSpeechChange(selection) {
    let selectedSpeech = this.createForm.get('speechLanguage').value;
    if (selectedSpeech) {
      this.voicesList = selectedSpeech.voices;
      this.createForm.get('voice').patchValue(selectedSpeech.voices[0]);
    }
  }

  onSpeedChange() {
    this.audio.playbackRate = this.selectedSpeed || 1;  
  }
}
