import { inject, Injectable } from '@angular/core';
import { ConfirmationService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class ConfirmService {
  private confirm = inject(ConfirmationService);

  /**
   * Método genérico para pedir confirmación
   * @param action Función que se ejecuta si el usuario acepta
   * @param config Configuración opcional del mensaje
   */
  ask(action: () => void, config?: { message?: string, header?: string, icon?: string, isDanger?: boolean }) {
    this.confirm.confirm({
      header: config?.header || 'Confirmar acción',
      message: config?.message || '¿Estás seguro de realizar esta operación?',
      icon: config?.icon || 'pi pi-exclamation-triangle',
      acceptLabel: 'Confirmar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: config?.isDanger ? 'p-button-danger' : 'p-button-primary',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => action()
    });
  }
}
