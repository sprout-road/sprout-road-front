import {GeoJSON} from 'react-leaflet';
import {Layer} from 'leaflet';
import {useNavigate} from 'react-router-dom';
import {SidoGeoJson} from '../../../types/geoTypes';
import {getSidoStyle} from '../../../shared/utils/mapStyles';

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
}

function MapLayers({
                       sidoData
                   }: MapLayersProps) {
    const navigate = useNavigate();

    const onEachSidoFeature = (feature: Feature, layer: Layer) => {
        // 시도 클릭 이벤트 - 지역 상세 페이지로 이동
        layer.on('click', () => {
            const properties = feature.properties;
            console.log('클릭한 시도:', properties);

            // 지역 상세 페이지로 이동
            navigate(`/region/${properties.sidoCode}`);
        });

        // 필요에 따라 location 정보로 위치 표시 가능
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
        </>
    );
}

export default MapLayers;