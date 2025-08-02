import {GeoJSON} from 'react-leaflet';
import {Layer, PathOptions} from 'leaflet';
import {useNavigate} from 'react-router-dom';
import {RegionGeoJson, SidoGeoJson} from '../../types/geoTypes.ts';
import {getSidoStyle} from '../../shared/utils/mapStyles.ts';

interface MapLayersProps {
    sidoData: SidoGeoJson;
    regionData: Map<string, RegionGeoJson>;
    missionCounts: Map<string, number>;
}

interface FeatureProperties {
    sidoCode: string;
    sidoNameKo: string;
    sidoNameEn: string;
}

interface SidoFeature {
    properties: FeatureProperties;
}

// 색상 강도 타입 정의
type ColorIntensity = 'light' | 'medium' | 'dark';

function MapLayers({sidoData, regionData, missionCounts}: MapLayersProps) {
    const navigate = useNavigate();

    const onEachSidoFeature = (feature: SidoFeature, layer: Layer) => {
        // 시도 클릭 이벤트 - 지역 상세 페이지로 이동
        layer.on('click', () => {
            const properties = feature.properties;
            console.log('클릭한 시도:', properties);
            navigate(`/region/${properties.sidoCode}`);
        });
    };

    const getColorIntensity = (count: number, maxCount: number): ColorIntensity | null => {
        if (count === 0) return null; // 색칠 안함
        // 3단계로 구분: 연함(1-33%), 보통(34-66%), 진함(67-100%)
        const percentage = (count / maxCount) * 100;

        if (percentage <= 33) return 'light';
        if (percentage <= 66) return 'medium';
        return 'dark';
    };

    // GeoJSON Feature 타입 정의
    type GeoJSONFeature = {
        type: 'Feature';
        properties: {
            regionCode: string;
            [key: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
        };
        geometry: any; // eslint-disable-line @typescript-eslint/no-explicit-any
    };

    const getMissionRegionStyle = (feature?: GeoJSONFeature): PathOptions => {
        if (!feature?.properties) {
            return {
                fillColor: 'transparent',
                weight: 0,
                opacity: 0,
                fillOpacity: 0
            };
        }

        const regionCode = feature.properties.regionCode;
        const count = missionCounts.get(regionCode) || 0;

        if (count === 0) {
            return {
                fillColor: 'transparent',
                weight: 0,
                opacity: 0,
                fillOpacity: 0
            };
        }

        // 최대 카운트 계산
        const maxCount = Math.max(...Array.from(missionCounts.values()));
        const intensity = getColorIntensity(count, maxCount);

        // intensity가 null인 경우 처리
        if (!intensity) {
            return {
                fillColor: 'transparent',
                weight: 0,
                opacity: 0,
                fillOpacity: 0
            };
        }

        // 색상 매핑 - PathOptions 타입으로 완전히 정의
        const colorMap: Record<ColorIntensity, PathOptions> = {
            light: {
                fillColor: '#bbf7d0', // 연한 초록
                color: '#86efac',     // 연한 초록 경계선
                fillOpacity: 0.6,
                weight: 1,
                opacity: 1
            },
            medium: {
                fillColor: '#22c55e', // 보통 초록
                color: '#16a34a',     // 보통 초록 경계선
                fillOpacity: 0.7,
                weight: 1,
                opacity: 1
            },
            dark: {
                fillColor: '#15803d', // 진한 초록
                color: '#166534',     // 진한 초록 경계선
                fillOpacity: 0.8,
                weight: 1,
                opacity: 1
            }
        };

        return colorMap[intensity];
    };

    const onEachMissionRegionFeature = (feature: GeoJSONFeature, layer: Layer) => {
        if (!feature?.properties) return;

        layer.on('click', () => {
            // 해당 지역이 속한 시도 코드 추출 (regionCode의 앞 2자리)
            const regionCode = feature.properties.regionCode;
            const sidoCode = regionCode.substring(0, 2);

            console.log('미션 지역 클릭 → 시도로 이동:', sidoCode);
            navigate(`/region/${sidoCode}`);
        });
    };

    return (
        <>
            {/* ✅ 시도 레이어 */}
            <GeoJSON
                key="sido-layer"
                data={sidoData}
                style={(feature) => getSidoStyle(feature)}
                onEachFeature={onEachSidoFeature}
            />

            {/* 미션 완료 지역 오버레이 레이어 */}
            {Array.from(regionData.entries()).map(([sidoCode, geoJson]) => (
                <GeoJSON
                    key={`region-layer-${sidoCode}`}
                    data={geoJson}
                    style={getMissionRegionStyle}
                    onEachFeature={onEachMissionRegionFeature}
                />
            ))}
        </>
    );
}

export default MapLayers;