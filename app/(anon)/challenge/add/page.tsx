'use client';

import style from '@/app/(anon)/challenge/add/page.module.scss';
import Button from '@/components/Buttons/Button';
import MyPinsContainer from '../_component/MyPinsContainer';
import ChallengeAddPageTitle from '../_component/ChallengeAddPageTitle';
import { useState } from 'react';
import { MyPinDto } from '@/application/usecases/challenge/dto/MyPinDto';
import { ChallengeTopicDto } from '@/application/usecases/challenge/dto/ChallengeTopicDto';
import Link from 'next/link';

const ChallengeAdd = () => {
  const [challengeTopic, setchallengeTopic] =
    useState<ChallengeTopicDto | null>(null);
  const [myPins, setMyPins] = useState<MyPinDto[]>([]);
  const [selectedPins, setSelectedPins] = useState<MyPinDto[]>([]);

  const handleAddPinToChallengeButton = async () => {
    if (!challengeTopic || selectedPins.length === 0) {
      alert('최소 하나의 핀을 선택해주세요.');
      return;
    }

    const requestData = selectedPins.map((pin) => ({
      challengeTopicId: challengeTopic.id,
      pinId: pin.id,
    }));

    try {
      const response = await fetch('/api/create-pin-joined-challenge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },

        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        alert('챌린지 등록 성공!');
        window.location.href = '/challenge';
      } else {
        alert('이미 챌린지에 등록한 핀이 포함되어 있어요!');
      }
    } catch (error) {
      console.error('챌린지 등록 중 오류 발생:', error);
      alert('오류가 발생했습니다.');
    }
  };

  return (
    <div className={style.challengeAdd}>
      <ChallengeAddPageTitle
        challengeTopic={challengeTopic}
        setchallengeTopic={setchallengeTopic}
      />
      <p className={style.title}>이번주 챌린지에 등록할 핀을 선택해주세요!</p>
      {myPins.length === 0 && (
        <div className={style.noItems}>
          <p>챌린지에 등록할 핀이 없어요.</p>
          <p>지도에 핀을 찍어보세요!</p>
          <Link href={'/add'}>핀 등록하기</Link>
        </div>
      )}
      <MyPinsContainer
        myPins={myPins}
        setMyPins={setMyPins}
        selectedPins={selectedPins}
        setSelectedPins={setSelectedPins}
        topicId={challengeTopic?.id ?? ''}
      />
      {myPins.length > 0 && (
        <Button
          label='등록하기'
          onClickButton={handleAddPinToChallengeButton}
        />
      )}
    </div>
  );
};

export default ChallengeAdd;
