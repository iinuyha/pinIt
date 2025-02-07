import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    kakao: any;
  }
}

const useKakaoMap = ({
  lat,
  lng,
  jsApiKey,
}: {
  lat: number | null;
  lng: number | null;
  jsApiKey: string | undefined;
}) => {
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [boundsState, setBoundsState] = useState<{
    sw: any | null;
    ne: any | null;
  }>({
    sw: null,
    ne: null,
  });
  const boundsRef = useRef<{ sw: any | null; ne: any | null } | null>(null);
  const [response, setResponse] = useState<any>(null);

  useEffect(() => {
    if (!lat || !lng) return;

    const kakaoMapScript = document.createElement('script');
    kakaoMapScript.async = true;
    kakaoMapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${jsApiKey}&autoload=false`;
    document.head.appendChild(kakaoMapScript);

    const onLoadKakaoAPI = () => {
      window.kakao.maps.load(() => {
        const coords = new window.kakao.maps.LatLng(lat, lng);
        const container = document.getElementById('map');
        const options = {
          center: coords,
          level: 3,
        };

        const map = new window.kakao.maps.Map(container, options);
        mapRef.current = map;

        // 초기 지도 범위 내 장소 가져오기
        setTimeout(() => {
          fetchPin(map.getBounds());
        }, 500);

        // 현재 위치에 마커 표시
        const marker = new window.kakao.maps.Marker({
          position: coords,
        });

        marker.setMap(map);
        markerRef.current = marker;

        // 지도 이동할 때마다 fetchPin 실행
        window.kakao.maps.event.addListener(map, 'dragend', () => {
          fetchPin(map.getBounds());
        });

        window.kakao.maps.event.addListener(map, 'zoom_changed', () => {
          fetchPin(map.getBounds());
        });
      });
    };

    kakaoMapScript.addEventListener('load', onLoadKakaoAPI); // 스크립트가 완전히 로드된 후 onLoadKakaoAPI 실행
  }, [lat, lng, jsApiKey]);

  const fetchPin = async (bounds: any) => {
    if (!window.kakao || !window.kakao.maps) return;

    if (!bounds || !bounds.getSouthWest || !bounds.getNorthEast) {
      console.error('fetchPin에 전달된 bounds 값이 올바르지 않습니다.', bounds);
      return;
    }

    // 남서쪽 좌표(왼쪽 아래), 북동쪽 좌표(오른쪽 위)
    const newBounds = {
      sw: bounds.getSouthWest(),
      ne: bounds.getNorthEast(),
    };

    // console.log('받은 bounds:', bounds);

    // useRef를 활용하여 bounds 값을 강제 적용
    boundsRef.current = newBounds;
    setBoundsState(newBounds);
    // console.log('처리된 bounds:', newBounds);

    try {
      setResponse(response);
    } catch (error) {
      console.error('Error fetching places: ', error);
    }
  };

  return { mapRef, markerRef, boundsState, fetchPin };
};

export default useKakaoMap;
