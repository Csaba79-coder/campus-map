import { Component, inject, OnInit, AfterViewInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BuildingService, Building } from '../services/building';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { finalize } from 'rxjs';
import * as L from 'leaflet';
import 'leaflet-draw';

function polygonMinPoints(control: AbstractControl): ValidationErrors | null {
  const points = control.value;
  if (!points || points.length < 3) {
    return { minPoints: { required: 3, actual: points ? points.length : 0 } };
  }
  return null;
}

@Component({
  selector: 'app-building-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './building-form.html',
  styleUrl: './building-form.css',
})
export class BuildingForm implements OnInit, AfterViewInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  protected router = inject(Router);
  private buildingService = inject(BuildingService);
  private snackBar = inject(MatSnackBar);

  buildingForm!: FormGroup;
  loading = signal(false);
  isEdit = signal(false);
  buildingId: any = null;

  private map!: L.Map;
  private drawnItems = new L.FeatureGroup();
  polygon = signal<[number, number][]>([]);

  ngOnInit(): void {
    this.buildingForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      isPublic: [false],
      polygon: [[], polygonMinPoints],
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit.set(true);
      this.buildingId = id;
      this.loadBuilding(this.buildingId);
    }
  }

  ngAfterViewInit(): void {
    if (!this.isEdit()) {
      this.initMap();
    }
  }

  private initMap(): void {
    this.map = L.map('building-map', { doubleClickZoom: false }).setView([47.0927, 17.9094], 17);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(this.map);

    this.map.addLayer(this.drawnItems);

    const drawControl = new L.Control.Draw({
      edit: {
        featureGroup: this.drawnItems,
      },
      draw: {
        polygon: {
          allowIntersection: false,
          showArea: false,
        },
        polyline: false,
        circle: false,
        rectangle: false,
        marker: false,
        circlemarker: false,
      },
    });
    this.map.addControl(drawControl);

    this.map.on(L.Draw.Event.CREATED, (event: any) => {
      this.drawnItems.clearLayers();
      const layer = event.layer;
      this.drawnItems.addLayer(layer);
      const latLngs = layer.getLatLngs()[0];
      this.polygon.set(latLngs.map((ll: L.LatLng) => [ll.lat, ll.lng]));
      this.buildingForm.get('polygon')?.setValue(this.polygon());
    });

    this.map.on(L.Draw.Event.DELETED, () => {
      this.polygon.set([]);
      this.buildingForm.get('polygon')?.setValue(this.polygon());
    });

    this.map.on(L.Draw.Event.EDITED, (event: any) => {
      const layers = event.layers;
      layers.eachLayer((layer: any) => {
        const latLngs = layer.getLatLngs()[0];
        this.polygon.set(latLngs.map((ll: L.LatLng) => [ll.lat, ll.lng]));
        this.buildingForm.get('polygon')?.setValue(this.polygon());
      });
    });
  }

  private loadBuilding(id: any): void {
    this.loading.set(true);
    this.buildingService
      .getById(id)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (building) => {
          this.buildingForm.patchValue({
            name: building.name,
            description: building.description,
            isPublic: building.isPublic,
            polygon: building.polygon,
          });
          this.polygon.set(building.polygon);
          setTimeout(() => {
            this.initMap();
            this.drawExistingPolygon(building.polygon);
            this.map.invalidateSize();
          }, 100);
        },
        error: () =>
          this.snackBar.open('Failed to load building', 'Close', { duration: 3000 }),
      });
  }

  private drawExistingPolygon(coords: [number, number][]): void {
    if (coords && coords.length > 0) {
      this.drawnItems.clearLayers();
      const latLngs = coords.map((c) => L.latLng(c[0], c[1]));
      const poly = L.polygon(latLngs, { color: '#3388ff' });
      this.drawnItems.addLayer(poly);
      this.map.fitBounds(poly.getBounds());
    }
  }

  onSubmit(): void {
    if (this.buildingForm.invalid) {
      return;
    }

    const building: Building = {
      ...this.buildingForm.value,
      polygon: this.polygon(),
      userId: 1,
    };

    this.loading.set(true);

    const request$ = this.isEdit()
      ? this.buildingService.update(this.buildingId, building)
      : this.buildingService.create(building);

    request$.pipe(finalize(() => this.loading.set(false))).subscribe({
      next: () => {
        this.snackBar.open(
          this.isEdit() ? 'Building updated' : 'Building created',
          'Close',
          { duration: 3000 }
        );
        this.router.navigate(['/buildings']);
      },
      error: () =>
        this.snackBar.open('Failed to save building', 'Close', { duration: 3000 }),
    });
  }
}
