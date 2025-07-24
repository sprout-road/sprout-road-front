import { useEffect, useState } from 'react';
import KoreanMap from '../components/KoreanMap';
import { SidoGeoJson } from '../types/geoTypes';
// import '../styles/global.css'; // 일단 주석 처리

function RegionColoring() {
    const [sidoData, setSidoData] = useState<SidoGeoJson | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSidoData = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:8080/api/gis/sido');

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setSidoData(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : '지도 데이터를 불러오는데 실패했습니다.');
                console.error('Sido 데이터 로드 실패:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchSidoData();
    }, []);

    if (loading) {
        return (
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'white',
                fontSize: '18px',
                color: '#666'
            }}>
                지도 로딩중...
            </div>
        );
    }

    if (error) {
        return (
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'white',
                fontSize: '18px',
                color: '#e74c3c'
            }}>
                오류: {error}
            </div>
        );
    }

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            margin: 0,
            padding: 0,
            backgroundColor: 'white'
        }}>
            {sidoData && <KoreanMap sidoData={sidoData} />}
        </div>
    );
}

export default RegionColoring;