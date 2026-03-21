import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { PaginatorModule } from 'primeng/paginator';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { SelectModule } from 'primeng/select'; // PrimeNG 21

import { Libro } from '../../types/libro-type';
import { LibroDetailComponent } from '../../components/libro-detail-component/libro-detail-component';
import { LibroFormComponent } from '../../components/libro-form-component/libro-form-component';
import { LibroService } from '../../services/libro-service';

@Component({
  selector: 'app-libro-page',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ButtonModule, InputTextModule, 
    IconFieldModule, InputIconModule, PaginatorModule, SelectModule,
    LibroDetailComponent, LibroFormComponent, ConfirmDialogModule
  ],
  providers: [ConfirmationService],
  templateUrl: './libro-page.html'
})
export class LibroPage {
  public libroService = inject(LibroService);
  private confirmationService = inject(ConfirmationService);

  isDialogVisible = signal(false);
  selectedLibro = signal<Libro | null>(null);
  searchTerm = signal('');
  

  // Opciones para el ordenamiento
  orderOptions = [
    { label: 'Título (A-Z)', value: { col: 'titulo', dir: 'asc' } },
    { label: 'Título (Z-A)', value: { col: 'titulo', dir: 'desc' } },
    { label: 'Páginas (Menor)', value: { col: 'paginas', dir: 'asc' } },
    { label: 'Páginas (Mayor)', value: { col: 'paginas', dir: 'desc' } }
  ];
  selectedOrder = signal(this.orderOptions[0].value);

  // --- Acciones ---
  openCreate() {
    this.selectedLibro.set(null);
    this.isDialogVisible.set(true);
  }

  openEdit(libro: Libro) {
    this.selectedLibro.set(libro);
    this.isDialogVisible.set(true);
  }

  onSearch(value: string) {
    this.searchTerm.set(value);
    this.libroService.setSearch(value);
  }

  onSortChange(event: any) {
    const sortData = event.value; 
  
    if (sortData && sortData.col) {
      this.libroService.setSorting(sortData.col, sortData.dir);
    }
  }

  handleCreate(nuevoLibro: Omit<Libro, 'id'>) {
    this.libroService.create(nuevoLibro);
    this.isDialogVisible.set(false);
  }

  handleUpdate(libroActualizado: Libro) {
    this.libroService.update(libroActualizado.id, libroActualizado);
    this.isDialogVisible.set(false);
    this.selectedLibro.set(null);
  }

  confirmDelete(libro: Libro) {
    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar "${libro.titulo}"? Esta acción no se puede deshacer.`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-circle',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => this.libroService.delete(libro.id)
    });
  }

  onPageChange(event: any) {
    this.libroService.setPage(event.page + 1, event.rows);
    // Scroll suave al inicio al cambiar de página
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}