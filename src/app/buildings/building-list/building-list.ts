import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectUserId } from '../../auth/store/auth.selectors';
import { BuildingService, Building } from '../services/building';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { AreaPipe } from '../../shared/pipes/area-pipe';
import { finalize } from 'rxjs';
import { DblClickEdit } from '../../shared/directives/dbl-click-edit';

@Component({
  selector: 'app-building-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatSlideToggleModule,
    FormsModule,
    AreaPipe,
    DblClickEdit,
  ],
  templateUrl: './building-list.html',
  styleUrl: './building-list.css',
})
export class BuildingList implements OnInit {
  private buildingService = inject(BuildingService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private store = inject(Store);

  buildings = signal<Building[]>([]);
  searchTerm = signal('');
  loading = signal(false);
  showPublic = signal(false);
  currentUserId = signal<string | null>(null);

  filteredBuildings = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const userId = this.currentUserId();
    return this.buildings()
      .filter((b) => {
        if (this.showPublic()) {
          return b.userId === userId || b.isPublic;
        }
        return b.userId === userId;
      })
      .filter((b) =>
        b.name.toLowerCase().includes(term) || b.description.toLowerCase().includes(term)
      );
  });

  displayedColumns = ['name', 'description', 'area', 'actions'];

  ngOnInit(): void {
    this.store.select(selectUserId).subscribe((userId) => {
      this.currentUserId.set(userId);
    });
    this.loadBuildings();
  }

  loadBuildings(): void {
    this.loading.set(true);
    this.buildingService
      .getAll()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (buildings) => this.buildings.set(buildings),
        error: (err) =>
          this.snackBar.open('Failed to load buildings', 'Close', { duration: 3000 }),
      });
  }

  onAdd(): void {
    this.router.navigate(['/buildings/new']);
  }

  onEdit(id: any): void {
    this.router.navigate(['/buildings/edit', id]);
  }

  onDelete(id: any): void {
    this.loading.set(true);
    this.buildingService
      .delete(id)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.snackBar.open('Building deleted', 'Close', { duration: 3000 });
          this.loadBuildings();
        },
        error: () =>
          this.snackBar.open('Failed to delete building', 'Close', { duration: 3000 }),
      });
  }

  isOwner(building: Building): boolean {
    return building.userId === this.currentUserId();
  }

  trackById(index: number, building: Building): any {
    return building.id;
  }
}
