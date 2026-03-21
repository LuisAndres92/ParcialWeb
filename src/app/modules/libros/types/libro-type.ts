export interface Libro {
  id: number;
  titulo: string;
  autores: string[]; // lista de autores añadidos manualmente
  generos: string[]; // selección de géneros estáticos
  isbn: string;
  descripcion?: string;
  fechaPublicacion?: string; // ISO fecha en string, p.ej. "2026-03-19"
  paginas?: number;
  disponible: boolean;
}

