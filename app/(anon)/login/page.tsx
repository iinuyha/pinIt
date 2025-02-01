'use client';

import style from '@/app/(anon)/login/page.module.scss';
import { browserClient } from '@/utils/supabase/client';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const Login = () => {
  const [originUrl, setOriginUrl] = useState('');

  useEffect(() => {
    setOriginUrl(window.location.origin);
  }, []);

  const signInWithKakao = async () => {
    const supabase = browserClient();
    await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: {
        redirectTo: `${originUrl}/auth/callback`,
      },
    });
  };

  return (
    <div className={style.login}>
      <Image
        className={style.logo}
        src='/logo_main.png'
        alt='PinIt 메인 로고'
        width={292}
        height={233}
        priority
      />
      <button
        className={style.loginButton}
        type='button'
        onClick={signInWithKakao}
      >
        <Image
          src={'/kakao_login_medium_wide.png'}
          alt='카카오 로그인 이미지'
          width={300}
          height={45}
        />
      </button>
    </div>
  );
};

export default Login;
