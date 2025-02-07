'use client';

import { useState } from 'react';
import AddressSection from './_components/AddressSection';
import MapSection from './_components/MapSection';
import styles from './addLocation.module.scss';

// Location 타입 정의
interface Location {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

interface AddLocationProps {
  onLocationSearchPopupClose: () => void; // 부모에게 팝업 닫기 알림
  onLocationSelect: (location: Location) => void; // 선택한 위치 전달 함수
}

const AddLocation: React.FC<AddLocationProps> = ({
  onLocationSearchPopupClose,
  onLocationSelect,
}) => {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null,
  );

  // 지도에서 위치 선택 시 상태 업데이트
  const handleSelectLocation = (location: Location) => {
    setSelectedLocation(location);
  };

  // AddressSection에서 버튼 클릭 시 실행
  const handleRegisterLocation = () => {
    console.log('click handleRegisterLocation!');

    if (selectedLocation) {
      console.log(selectedLocation);
      onLocationSelect(selectedLocation); // 선택한 위치 부모 컴포넌트로 전달
      onLocationSearchPopupClose(); // AddLocation 팝업 닫기
    }
  };

  return (
    <div className={styles.addLocationContainer}>
      {/* 지도 섹션 */}
      <MapSection onAddressChange={handleSelectLocation} />

      {/* 주소 정보 */}
      <AddressSection
        placeName={selectedLocation?.name || '로딩 중'}
        address={selectedLocation?.address || '주소 검색 중...'}
        onAddLocationPopupClose={handleRegisterLocation} // 버튼 클릭 시 처리
      />
    </div>
  );
};

export default AddLocation;
