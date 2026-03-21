import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  constructor(private messageService: MessageService) {}

  showAlert(type: 'success' | 'error' | 'warning' | 'info', message: string, summary?: string) {
    const severity = type === 'error' ? 'error' : type === 'warning' ? 'warn' : type;
    const defaultSummary = summary || this.getDefaultSummary(type);

    this.messageService.add({
      severity,
      summary: defaultSummary,
      detail: message
    });
  }

  private getDefaultSummary(type: 'success' | 'error' | 'warning' | 'info'): string {
    const summaries = {
      success: 'Success',
      error: 'Error',
      warning: 'Warning',
      info: 'Information'
    };
    return summaries[type];
  }
}
