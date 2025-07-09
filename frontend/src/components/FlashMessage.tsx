// src/components/FlashMessage.tsx
import { useEffect, useState } from 'react';

interface Props {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const FlashMessage: React.FC<Props> = ({ message, type, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return visible ? (
    <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded shadow-lg text-white transition-all duration-500 ${
      type === 'success' ? 'bg-green-600' : 'bg-red-600'
    }`}>
      {message}
    </div>
  ) : null;
};

export default FlashMessage;
