import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {SwrlService} from '../../core/services/swrl/swrl.service';
import {SwrlRequestModel} from '../../shared/models/swrlRequest.model';
import {SWRLResponseModel} from '../../shared/models/SWRLResponse.model';
import {AiAskRequest, AiService} from '../../core/services/aiService/ai.service';

@Component({
  selector: 'app-swrl-environment',
  templateUrl: './swrl-environment.component.html',
  styleUrls: ['./swrl-environment.component.css']
})
export class SwrlEnvironmentComponent implements OnInit {

  isFileUploaded = false;
  fileName = '';
  // Textareas
  glossaryText = '';
  relationsText = '';
  validationReportText = '';
  errorHandlingText = '';
  ttlContent: string;
  swrlRule = '';
  chatHistory = '';
  chatInput = '';
  isLoadingAi = false;

  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLDivElement>;

  private scrollToBottom() {
    try {
      const el = this.scrollContainer.nativeElement;
      el.scrollTop = el.scrollHeight;
    } catch {
    }
  }

  constructor(private swrlService: SwrlService, private aiService: AiService) {
  }

  ngOnInit(): void {
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      this.fileName = file.name;

      const reader = new FileReader();
      reader.onload = () => {
        this.ttlContent = <string>reader.result;
        this.isFileUploaded = true;

        this.swrlService.getGlossary(this.ttlContent).subscribe({
          next: (glossary: string[]) => {
            this.glossaryText = glossary.map(s => `${s}`).join('\n');
          },
          error: (err) => {
            console.error('Failed to fetch glossary', err);
          }
        });
        this.swrlService.getRelations(this.ttlContent).subscribe({
          next: (relations: string[]) => {
            this.relationsText = relations.map(s => `${s}`).join('\n');
          },
          error: (err) => {
            console.error('Failed to fetch relations', err);
          }
        });
      };

      reader.readAsText(file);
    }
  }

  onExecuteRule(): void {
    const swrlDto: SwrlRequestModel = {
      ttlContent: this.ttlContent,
      rule: {
        ruleName: '',
        ruleContent: this.swrlRule
      }
    };

    this.swrlService.applySWRLRule(swrlDto).subscribe({
      next: (r: SWRLResponseModel) => {
        this.validationReportText = r[0].results.join('\n');
        this.errorHandlingText = r[0].error;
      },
      error: (err) => {
        console.error('Failed to apply rule', err);
      }
    });
  }

  onApplyResults(): void {
    // TODO: implement
  }

  onExportResults(): void {
    // TODO: implement
  }


  sendToAi() {
    if (!this.chatInput?.trim()) {
      return;
    }

    // Append user question
    this.chatHistory += (this.chatHistory ? '\n\n' : '') + '<b>question:</b> ' + this.chatInput;

    const body: AiAskRequest = {
      userMessage: this.chatInput,
      swrlRule: this.swrlRule || '',
      ttlContent: this.ttlContent || ''  // adjust if your field is named differently
    };

    const currentInput = this.chatInput;
    this.chatInput = '';

    this.isLoadingAi = true;   // start spinner

    this.aiService.askOllama(body).subscribe({
      next: (res: string) => {
        const text = res?.trim() || '(no response from model)';
        this.chatHistory += '\n\n<b>answer:</b> ' + text;

        setTimeout(() => this.scrollToBottom(), 50); // ensures DOM has updated
        this.isLoadingAi = false;
      },
      error: (err) => {
        this.chatHistory += '\n\nanswer: Error calling AI: ' + (err?.message || err);
        this.isLoadingAi = false;   // stop spinner even on error
      }
    });
  }


}
