'use client';

import { useEffect, useState } from 'react';
import styles from './CurrentTime.module.scss';

export function CurrentTime() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () =>
      setTime(new Date().toLocaleTimeString('ja-JP'));
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <p className={styles.time}>ページ取得時刻: {time}</p>
  );
}
