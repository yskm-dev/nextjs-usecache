'use client';

import { useTransition } from 'react';
import styles from './RevalidateButton.module.scss';

export function RevalidateButton({
  action,
  label,
}: {
  action: () => Promise<void>;
  label: string;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      className={styles.button}
      disabled={isPending}
      onClick={() => startTransition(() => action())}
    >
      {isPending ? '更新中...' : label}
    </button>
  );
}
