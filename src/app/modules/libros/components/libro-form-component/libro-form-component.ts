import { Component, computed, effect, inject, input, model, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { CheckboxModule } from 'primeng/checkbox';
import { Libro } from '../../types/libro-type';
import { GENEROS_LIBRO } from '../../constants/genero-list-constant';
import { FormService } from '../../../../core/services/form-service';

@Component({
  selector: 'app-libro-form-component',
  standalone: true,
  imports: [
    Dialog, ButtonModule, InputTextModule, FormsModule, 
    ReactiveFormsModule, MultiSelectModule, CheckboxModule, TextareaModule
  ],
  templateUrl: './libro-form-component.html'
})
export class LibroFormComponent {
  // --- New Signals API ---
  visible = model(false); // model() permite [(visible)] bidireccional
  libro = input<Libro | null>(null);
  
  close = output<void>();
  create = output<Omit<Libro, 'id'>>();
  update = output<Libro>();

  private fb = inject(FormBuilder);
  private formService = inject(FormService);

  libroForm: FormGroup = this.initForm();
  nuevoAutor = signal(''); // Signal para el input de autor

  // Computed para las opciones de géneros
  generosOptions = computed(() => 
    GENEROS_LIBRO.map((genero) => ({ label: genero, value: genero }))
  );

  constructor() {
    // Sustituto moderno de ngOnChanges
    effect(() => {
      const libroActual = this.libro();
      if (libroActual) {
        this.libroForm.patchValue({
          ...libroActual,
          autores: libroActual.autores ?? [],
          generos: libroActual.generos ?? [],
        });
      } else {
        this.resetForm();
      }
    });
  }

  private initForm(): FormGroup {
    return this.fb.group({
      id: [null],
      titulo: ['', [Validators.required, Validators.minLength(2)]],
      autores: [<string[]>[], [Validators.required, Validators.minLength(1)]],
      generos: [<string[]>[], Validators.required],
      isbn: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: [''],
      fechaPublicacion: [''],
      paginas: [null, [Validators.min(1)]],
      disponible: [true, Validators.required],
    });
  }

  addAutor(): void {
    const autor = this.nuevoAutor().trim();
    if (!autor) return;

    const autoresControl = this.libroForm.get('autores');
    const autoresActuales = autoresControl?.value as string[];

    if (!autoresActuales.includes(autor)) {
      autoresControl?.setValue([...autoresActuales, autor]);
    }
    this.nuevoAutor.set('');
  }

  removeAutor(index: number): void {
    const autoresControl = this.libroForm.get('autores');
    const autoresActuales = [...(autoresControl?.value as string[])];
    autoresActuales.splice(index, 1);
    autoresControl?.setValue(autoresActuales);
  }

  onSubmit(): void {
    if (this.libroForm.invalid) {
      // ... validación
      return;
    }

    // 1. Extraemos los datos actuales del form
    const formValues = this.libroForm.getRawValue(); // getRawValue por si hay campos disabled
    const idActual = this.libro()?.id;

    if (idActual) {
      // 2. Si es edición, enviamos el objeto con su ID original
      this.update.emit({ ...formValues, id: idActual });
    } else {
      // 3. Si es creación, quitamos el ID
      const { id, ...newBook } = formValues;
      this.create.emit(newBook);
    }

    // 4. Cerramos DESPUÉS de emitir
    this.visible.set(false); 
    // Nota: No llames a resetForm aquí si el effect() ya se encarga de limpiar 
    // cuando libro() pasa a ser null.
  }

  closeDialog(): void {
    this.resetForm();
    this.visible.set(false);
    this.close.emit();
  }

  resetForm(): void {
    this.libroForm.reset({ disponible: true, autores: [], generos: [] });
    this.nuevoAutor.set('');
  }

  invalidField(fieldName: string): boolean {
    return this.formService.isFieldInvalid(this.libroForm, fieldName);
  }
}