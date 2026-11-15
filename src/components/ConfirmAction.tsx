import { useEffect, useRef } from 'react';

export function ConfirmAction({ message, onConfirm, onCancel }: {
  message: string; onConfirm: () => void; onCancel: () => void;
}) {
  const confirm = useRef<HTMLButtonElement>(null);
  useEffect(() => { confirm.current?.focus({ preventScroll: true }); }, []);
  return <div className="confirm-action" role="group" aria-label={message}>
    <p>{message}</p><div className="actions">
      <button ref={confirm} onClick={onConfirm}>Xác nhận xóa</button><button onClick={onCancel}>Hủy</button>
    </div>
  </div>;
}
