import React from 'react';

type DialogProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};
export default function Dialog({ open, onClose, children }: DialogProps) {
  const ref = React.useRef<HTMLDialogElement>(null);
  const openDialog = () => {
    if (ref.current) {
      ref.current.showModal();
    }
  };

  const closeDialog = () => {
    if (ref.current) {
      ref.current.close();
    }
  };

  React.useEffect(() => {
    if (open) {
      openDialog();
    } else {
      closeDialog();
    }
  }, [open]);

  return (
    <dialog ref={ref} onClose={onClose}>
      {children}
    </dialog>
  );
}
