import {GeoJSON} from 'react-leaflet';
import {Layer} from 'leaflet';
import {useNavigate} from 'react-router-dom';
import {RegionGeoJson, SidoGeoJson} from '../../types/geoTypes.ts';
import {getSidoStyle} from '../../shared/utils/mapStyles.ts';

interface MapLayersProps {
    sidoData: SidoGeoJson;
}

interface FeatureProperties {
    sidoCode: string;
    sidoNameKo: string;
    sidoNameEn: string;
}

interface Feature {
    properties: FeatureProperties;
    regionData: Map<string, RegionGeoJson>;
    missionCounts: Map<string, number>;
}

function MapLayers({sidoData, regionData, missionCounts}: MapLayersProps) {
    const navigate = useNavigate();

    const onEachSidoFeature = (feature: Feature, layer: Layer) => {
        // 시도 클릭 이벤트 - 지역 상세 페이지로 이동
        layer.on('click', () => {
            const properties = feature.properties;
            console.log('클릭한 시도:', properties);
            navigate(`/region/${properties.sidoCode}`);
        });

        // 필요에 따라 location 정보로 위치 표시 가능
    };

    const getRegionStyle = (feature: any) => {
        const regionCode = feature.properties.regionCode;
        const count = missionCounts.get(regionCode) || 0;

        if (count > 0) {
            return {
                fillColor: '#22c55e', // 초록색
                weight: 1,
                opacity: 1,
                color: '#16a34a', // 진한 초록 경계선
                fillOpacity: 0.6
            };
        } else {
            return {
                fillColor: 'transparent',
                weight: 0,
                opacity: 0,
                fillOpacity: 0
            };
        }
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

            {Array.from(regionData.entries()).map(([sidoCode, geoJson]) => (
                <GeoJSON
                    key={`region-layer-${sidoCode}`}
                    data={geoJson}
                    style={getRegionStyle}
                />
            ))}
        </>
    );
}

export default MapLayers;