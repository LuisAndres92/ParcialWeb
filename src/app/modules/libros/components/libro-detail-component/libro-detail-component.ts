import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { TooltipModule } from 'primeng/tooltip';
import { Libro } from '../../types/libro-type';

@Component({
  selector: 'app-libro-detail-component',
  standalone: true,
  imports: [CommonModule, ButtonModule, TagModule, CardModule, TooltipModule],
  templateUrl: './libro-detail-component.html',
  styleUrl: './libro-detail-component.css',
})
export class LibroDetailComponent {
  // Input de Signal (Angular 21)
  libro = input.required<Libro>();

  // Outputs para acciones del CRUD
  edit = output<Libro>();
  delete = output<Libro>();

  onEdit() {
    this.edit.emit(this.libro());
  }

  onDelete() {
    this.delete.emit(this.libro());
  }
}