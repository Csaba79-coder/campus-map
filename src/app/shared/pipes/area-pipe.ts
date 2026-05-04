import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'area',
  standalone: true,
})
export class AreaPipe implements PipeTransform {
  transform(polygon: [number, number][]): string {
    if (!polygon || polygon.length < 3) {
      return '0 m²';
    }

    let area = 0;
    for (let i = 0; i < polygon.length; i++) {
      const j = (i + 1) % polygon.length;
      area += polygon[i][0] * polygon[j][1];
      area -= polygon[j][0] * polygon[i][1];
    }
    area = Math.abs(area) / 2;

    const areaInMeters = area * 111_320 * 110_540;

    if (areaInMeters > 1_000_000) {
      return (areaInMeters / 1_000_000).toFixed(2) + ' km²';
    }
    return areaInMeters.toFixed(1) + ' m²';
  }
}
