// GeoJSON 타입 정의

// ✅ 베이스 속성 인터페이스
export interface BaseProperties {
    [key: string]: string | number | boolean | null | undefined;
}

// ✅ extends BaseProperties 추가
export interface SidoProperties extends BaseProperties {
    sidoCode: string;
    sidoNameKo: string;
    sidoNameEn: string;
    "centerLat": number;
    "centerLng": number;
}

// ✅ extends BaseProperties 추가
export interface SigunguProperties extends BaseProperties {
    sidoCode: string;
    sigCode: string;
    sigNameKo: string;
    sigNameEn: string;
    "centerLat": number;
    "centerLng": number;
}

export interface RegionProperties extends BaseProperties {
    regionCode: string;
    regionName: string;
    "centerLat": number;
    "centerLng": number;
}

// 면(Polygon) 지오메트리
export interface PolygonGeometry {
    type: 'MultiPolygon' | 'Polygon';
    coordinates: number[][][];
}

// 선(LineString) 지오메트리 - 바운더리용
export interface LineStringGeometry {
    type: 'LineString' | 'MultiLineString';
    coordinates: number[][] | number[][][];
}

// 일반 Feature (면)
export interface GeoJsonFeature<T extends BaseProperties = BaseProperties> {
    type: 'Feature';
    properties: T;
    geometry: PolygonGeometry;
}

// 바운더리 Feature (선)
export interface BoundaryFeature<T extends BaseProperties = BaseProperties> {
    type: 'Feature';
    properties: T;
    geometry: LineStringGeometry;
}

export interface GeoJsonFeatureCollection<T extends BaseProperties = BaseProperties> {
    type: 'FeatureCollection';
    features: GeoJsonFeature<T>[];
}

// 바운더리 FeatureCollection
export interface BoundaryFeatureCollection<T extends BaseProperties = BaseProperties> {
    type: 'FeatureCollection';
    features: BoundaryFeature<T>[];
}

// 시도 GeoJSON 타입 (면)
export type SidoGeoJson = GeoJsonFeatureCollection<SidoProperties>;

// 시도 바운더리 타입 (선)
export type SidoBoundaryGeoJson = BoundaryFeatureCollection<SidoProperties>;

// 시군구 GeoJSON 타입 (면)
export type SigunguGeoJson = GeoJsonFeatureCollection<SigunguProperties>;

// 지역 GeoJSON 타입 (면)
export type RegionGeoJson = GeoJsonFeatureCollection<RegionProperties>;

// 시군구 바운더리 타입 (선) - 삭제 (더 이상 사용 안 함)
// export type SigunguBoundaryGeoJson = BoundaryFeatureCollection<SigunguProperties>;

// 서버에서 받을 위치 하이라이트 응답 타입

export interface LocationResponse {
    regionCode: string;
    regionName: string;
    centerLat: number;
    centerLng: number;
}

// 캐시용 Properties 타입 추가
export interface SigunguPropertiesCache {
    sidoCode: string;
    properties: SigunguProperties[];
    timestamp: number;
}