export interface SidoProperties {
    sidoCode: string;
    sidoNameKo: string;
    sidoNameEn: string;
}

export interface SigunguProperties {
    sidoCode: string;
    sigCode: string;
    sigNameKo: string;
    sigNameEn: string;
}

export interface GeoJsonFeature<T = any> {
    type: 'Feature';
    properties: T;
    geometry: {
        type: 'MultiPolygon' | 'Polygon';
        coordinates: number[][][];
    };
}

export interface GeoJsonFeatureCollection<T = any> {
    type: 'FeatureCollection';
    features: GeoJsonFeature<T>[];
}

export type SidoGeoJson = GeoJsonFeatureCollection<SidoProperties>;

export type SigunguGeoJson = GeoJsonFeatureCollection<SigunguProperties>;

export interface LocationRequest {
    lat: number;
    lng: number;
}

export interface LocationResponse {
    code: string;
    nameKo: string;
    type: 'sido' | 'sigungu';
}