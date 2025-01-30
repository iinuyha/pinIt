'use client';

import style from '@/app/admin/page.module.scss';
import Button from '@/components/Buttons/Button';
import { useEffect, useRef } from 'react';

const ChallengeTopicContainer = () => {
    const mockData = [
        {
          id: '1',
          subject: '눈 내리는 겨울',
        },
        {
          id: '2',
          subject: '울긋불긋 가을 단풍',
        },
        {
          id: '3',
          subject: '아름다운 야경',
        },
    ];

    const scrollWrapperRef = useRef<HTMLDivElement>(null);
    const scrollContentTopRef = useRef<HTMLDivElement>(null);
    const scrollContentBottomRef = useRef<HTMLDivElement>(null);
    const scrollHeaderTopRef = useRef<HTMLDivElement>(null);
    const scrollHeaderBottomRef = useRef<HTMLDivElement>(null);
    const tableWrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const updateWidth = () => {
            const tableWidth = tableWrapperRef.current?.scrollWidth || 0;
            scrollContentTopRef.current?.style.setProperty('--scroll-width', `${tableWidth}px`);
            scrollContentBottomRef.current?.style.setProperty('--scroll-width', `${tableWidth}px`);
        };
  
        updateWidth(); // 초기값 설정
        window.addEventListener('resize', updateWidth); // 리사이즈 이벤트 바인딩
    
        return () => {
            window.removeEventListener('resize', updateWidth); // 이벤트 제거
        };
    }, []);

    const syncScroll = (source: "scroll_top" | "scroll_bottom" | "table") => {
        if (scrollHeaderTopRef.current && tableWrapperRef.current) {
            if (source === "scroll_top") {
                tableWrapperRef.current.scrollLeft = scrollHeaderTopRef.current.scrollLeft;
            } else {
                scrollHeaderTopRef.current.scrollLeft = tableWrapperRef.current.scrollLeft;
            }
        }
        if (scrollHeaderBottomRef.current && tableWrapperRef.current) {
            if (source === "scroll_bottom") {
                tableWrapperRef.current.scrollLeft = scrollHeaderBottomRef.current.scrollLeft;
            } else {
                scrollHeaderBottomRef.current.scrollLeft = tableWrapperRef.current.scrollLeft;
            }
        }
    };

    return (
        <>
        <div className={style.scroll_wrapper} ref={scrollWrapperRef}>
            <div className={style.scroll_header} ref={scrollHeaderTopRef} onScroll={() => syncScroll("scroll_top")}>
                <div className={style.scroll_content} ref={scrollContentTopRef}></div>
            </div>
            <div className={style.listContainer_wrapper} ref={tableWrapperRef} onScroll={() => syncScroll("table")}>
                <table className={style.listContainer}>
                    <thead>
                        <tr className={style.listHeader}>
                            {Object.keys(mockData[0]).map((item, index) => (
                                <th key={index} scope='col'>{item}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {mockData.map((item) => (
                            <tr key={item.id} className={style.listItem}
                                onClick={() => {console.log('hi');}}
                            >
                                {Object.values(item).map((details, index) => (
                                    <td key={index}>{details}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className={style.scroll_header} ref={scrollHeaderBottomRef} onScroll={() => syncScroll("scroll_bottom")}>
                <div className={style.scroll_content} ref={scrollContentBottomRef}></div>
            </div>
        </div>
        <div className={style.create_button}>
            <Button
                label='생성하기'
                onClickButton={() => {
                console.log('hi');
                }}
            />
        </div>
        </>
    );
}

export default ChallengeTopicContainer;