import { Injectable, signal, Signal, computed } from '@angular/core';
import { Libro } from '../types/libro-type';
import { FilteredPagedList } from '../../../core/models/filteredpagedlist-model';

@Injectable({
  providedIn: 'root',
})
export class LibroStore {
  // Estado privado (Fuente de verdad)
  private readonly _libros = signal<Libro[]>([]);
  private readonly _filtros = signal<FilteredPagedList>({
    valueSearch: null,
    orderColumn: null,
    orderList: null,
    page: 1,
    pageSize: 10,
  });

  // Exposición de señales de solo lectura
  libros: Signal<Libro[]> = this._libros.asReadonly();
  filtros: Signal<FilteredPagedList> = this._filtros.asReadonly();

  /**
   * Lógica de filtrado, ordenamiento y paginación centralizada.
   * Brilla aquí el uso de computed para derivar el estado.
   */
  readonly librosFiltrados: Signal<Libro[]> = computed(() => {
    const term = this._filtros().valueSearch?.trim().toLowerCase();
    let lista = [...this._libros()];

    // 1. Filtrado
    if (term) {
      lista = lista.filter((libro) => {
        const compare = (value?: string) => value?.toLowerCase().includes(term);

        const matchTitulo = compare(libro.titulo);
        const matchDescripcion = compare(libro.descripcion);
        const matchIsbn = compare(libro.isbn);
        const matchAutores = libro.autores.some((autor) => autor.toLowerCase().includes(term));
        const matchGeneros = libro.generos.some((genero) => genero.toLowerCase().includes(term));

        return matchTitulo || matchDescripcion || matchIsbn || matchAutores || matchGeneros;
      });
    }

    // 2. Ordenamiento
    const orderCol = this._filtros().orderColumn;
    const orderDir = this._filtros().orderList;

    if (orderCol && orderDir) {
      lista.sort((a, b) => {
        const aValue = String((a as any)[orderCol] ?? '').toLowerCase();
        const bValue = String((b as any)[orderCol] ?? '').toLowerCase();
        if (aValue === bValue) return 0;
        const result = aValue > bValue ? 1 : -1;
        return orderDir === 'asc' ? result : -result;
      });
    }

    // 3. Paginación
    const page = this._filtros().page;
    const pageSize = this._filtros().pageSize;
    const start = (page - 1) * pageSize;

    return lista.slice(start, start + pageSize);
  });

  /**
   * Retorna el total de libros que coinciden con el filtro actual
   * (Útil para el totalRecords del paginador de PrimeNG)
   */
  readonly totalFiltrados = computed(() => {
    const term = this._filtros().valueSearch?.trim().toLowerCase();
    if (!term) return this._libros().length;
    
    // Aplicamos solo el filtro (sin slice) para saber el total real
    return this._libros().filter(libro => {
        const compare = (v?: string) => v?.toLowerCase().includes(term);
        return compare(libro.titulo) || compare(libro.isbn) || 
               libro.autores.some(a => a.toLowerCase().includes(term));
    }).length;
  });

  // --- Métodos de Acción ---

  /**
   * Inicializa el store con datos externos (ej. localStorage)
   */
  init(libros: Libro[]): void {
    this._libros.set(libros);
  }

  setFiltros(filtros: Partial<FilteredPagedList>): void {
    this._filtros.update((prev) => ({ ...prev, ...filtros }));
  }

  setPage(page: number, pageSize: number): void {
    this._filtros.update((prev) => ({ ...prev, page, pageSize }));
  }

  setOrden(orderColumn: string | null, orderList: 'asc' | 'desc' | null): void {
    this._filtros.update((prev) => ({ ...prev, orderColumn, orderList }));
  }

  add(libro: Libro): Libro {
    const nuevo: Libro = { ...libro, id: this.nextId() };
    this._libros.update((list) => [...list, nuevo]);
    return nuevo;
  }

  update(id: number, changes: Partial<Libro>): Libro | null {
    let actualizado: Libro | null = null;
    this._libros.update((list) =>
      list.map((libro) => {
        if (libro.id !== id) return libro;
        actualizado = { ...libro, ...changes };
        return actualizado;
      })
    );
    return actualizado;
  }

  delete(id: number): boolean {
    const original = this._libros();
    const actualizado = original.filter((libro) => libro.id !== id);
    this._libros.set(actualizado);
    return actualizado.length !== original.length;
  }

  getById(id: number): Libro | undefined {
    return this._libros().find((libro) => libro.id === id);
  }

  private nextId(): number {
    const current = this._libros();
    return current.length ? Math.max(...current.map((l) => l.id)) + 1 : 1;
  }

  reset(): void {
    this._libros.set([]);
    this._filtros.set({ valueSearch: null, orderColumn: null, orderList: null, page: 1, pageSize: 10 });
  }
}