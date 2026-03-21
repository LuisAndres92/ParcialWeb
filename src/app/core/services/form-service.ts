import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AlertService } from './alert-service';

@Injectable({ providedIn: 'root' })
export class FormService {
  constructor(private alertService: AlertService) {}

  // Añadimos 'labels' para mapear el ID del campo con un nombre amigable
  validateForm(form: FormGroup, labels: Record<string, string>): void {
    form.markAllAsTouched(); // Angular ya tiene este método nativo, no necesitas el bucle manual
    this.showErrorMessage(form, labels);
  }

  showErrorMessage(form: FormGroup, labels: Record<string, string>): void {
    const invalidFields: string[] = [];
    
    Object.keys(form.controls).forEach(key => {
      const control = form.get(key);
      if (control && control.invalid) {
        // Buscamos el nombre amigable, si no existe usamos la clave
        invalidFields.push(labels[key] || key);
      }
    });

    if (invalidFields.length > 0) {
      const message = `Por favor complete los campos: ${invalidFields.join(', ')}`;
      this.alertService.showAlert('error', message);
    }
  }

  isFieldInvalid(form: FormGroup, fieldName: string): boolean {
    const control = form.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}