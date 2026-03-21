import { Injectable, Signal, effect, inject } from '@angular/core';
import { Libro } from '../types/libro-type';
import { LibroStore } from '../stores/libro-store';
import { FilteredPagedList } from '../../../core/models/filteredpagedlist-model';

@Injectable({
  providedIn: 'root',
})
export class LibroService {
  private readonly STORAGE_KEY = 'mis_libros_app';
  private readonly store = inject(LibroStore);

  constructor() {
    // 1. Cargamos datos iniciales
    this.loadFromStorage();

    // 2. Persistencia automática: Cada vez que la señal base de libros cambie,
    // actualizamos el localStorage.
    effect(() => {
      const librosActuales = this.store.libros(); 
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(librosActuales));
    });
  }

  // --- Getters de Señales (Interfaz con la UI) ---
  get libros(): Signal<Libro[]> {
    return this.store.librosFiltrados;
  }

  get filtros(): Signal<FilteredPagedList> {
    return this.store.filtros;
  }

  /**
   * Nueva señal expuesta para el paginador: 
   * Retorna el conteo total después de filtrar pero antes de paginar.
   */
  get totalFiltrados(): Signal<number> {
    return this.store.totalFiltrados;
  }

  // --- Operaciones CRUD ---
  create(libro: Omit<Libro, 'id'>): Libro {
    const nuevo = { ...libro, id: 0 } as Libro;
    return this.store.add(nuevo);
  }

  update(id: number, changes: Partial<Libro>): Libro | null {
    return this.store.update(id, changes);
  }

  delete(id: number): boolean {
    return this.store.delete(id);
  }

  // --- Consultas ---
  readAll(): Libro[] {
    return this.store.libros();
  }

  readById(id: number): Libro | undefined {
    return this.store.getById(id);
  }

  // --- Filtros, Ordenamiento y Paginación ---
  setSearch(term: string | null): void {
    // Siempre regresamos a la página 1 al realizar una nueva búsqueda
    this.store.setFiltros({ valueSearch: term, page: 1 });
  }

  /**
   * Nuevo: Método para gestionar el ordenamiento desde la UI
   */
  setSorting(orderColumn: string | null, orderList: 'asc' | 'desc' | null): void {
    this.store.setOrden(orderColumn, orderList);
    this.store.setPage(1, this.filtros().pageSize);
  }

  setPage(page: number, pageSize: number): void {
    this.store.setPage(page, pageSize);
  }

  resetFilters(): void {
    this.store.setFiltros({ 
      valueSearch: null, 
      orderColumn: null, 
      orderList: null, 
      page: 1, 
      pageSize: 10 
    });
  }

  // --- Persistencia ---
  private loadFromStorage(): void {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (data) {
      try {
        const librosCargados: Libro[] = JSON.parse(data);
        this.store.init(librosCargados); 
      } catch (error) {
        console.error('Error al parsear libros desde localStorage', error);
        localStorage.removeItem(this.STORAGE_KEY);
      }
    }
  }
}