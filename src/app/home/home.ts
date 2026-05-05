import { Component, inject, OnInit, AfterViewInit, signal } from '@angular/core';
import { BuildingService, Building } from '../buildings/services/building';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { finalize } from 'rxjs';
import * as L from 'leaflet';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatSnackBarModule, MatProgressSpinnerModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit, AfterViewInit {
  private buildingService = inject(BuildingService);
  private snackBar = inject(MatSnackBar);

  buildings = signal<Building[]>([]);
  loading = signal(false);
  selectedBuildingId = signal<number | null>(null);

  private map!: L.Map;
  private polygonMap = new Map<number, L.Polygon>();

  ngOnInit(): void {
    this.loadBuildings();
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('home-map').setView([47.0927, 17.9094], 16);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(this.map);
  }

  private loadBuildings(): void {
    this.loading.set(true);
    this.buildingService
      .getAll()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (buildings) => {
          this.buildings.set(buildings);
          this.drawBuildings(buildings);
        },
        error: () =>
          this.snackBar.open('Failed to load buildings', 'Close', { duration: 3000 }),
      });
  }

  private drawBuildings(buildings: Building[]): void {
    const group = new L.FeatureGroup();

    buildings.forEach((building) => {
      if (building.polygon && building.polygon.length >= 3) {
        const latLngs = building.polygon.map((c) => L.latLng(c[0], c[1]));
        const poly = L.polygon(latLngs, { color: '#3388ff' }).addTo(this.map);

        poly.bindTooltip(`<strong>${building.name}</strong><br>${building.description}<br><em>Points: ${building.polygon.length}</em>`, { sticky: true });

        poly.on('click', () => {
          this.selectBuilding(building.id!);
        });

        this.polygonMap.set(building.id!, poly);
        group.addLayer(poly);
      }
    });

    if (group.getLayers().length > 0) {
      this.map.fitBounds(group.getBounds(), { padding: [20, 20] });
    }
  }

  selectFromList(building: Building): void {
    this.selectBuilding(building.id!);
    const poly = this.polygonMap.get(building.id!);
    if (poly) {
      this.map.fitBounds(poly.getBounds(), { padding: [50, 50] });
    }
  }

  private selectBuilding(id: number): void {
    this.polygonMap.forEach((poly, polyId) => {
      poly.setStyle({ color: polyId === id ? '#ff4444' : '#3388ff', weight: polyId === id ? 4 : 3 });
    });
    this.selectedBuildingId.set(id);
  }
}
