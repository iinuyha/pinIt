'use client';

import React from 'react';
import InputBox from '@/components/InputBox/InputBox/InputBox';
import styles from '../add.module.scss';

interface LocationInputProps {
  onClick: () => void;
}

const LocationInput: React.FC<LocationInputProps> = ({ onClick }) => {
  return (
    <div className={styles.locationInputContainer}>
      <h3 className={styles.title}>촬영 장소 *</h3>
      <div onClick={onClick} style={{ cursor: 'pointer' }}>
        <InputBox placeholder='장소를 입력해주세요.' />
        <InputBox placeholder='상세 주소는 자동으로 입력됩니다.' />
      </div>
    </div>
  );
};

export default LocationInput;
