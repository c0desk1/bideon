// src/components/NewPostAlert.tsx
import React, { useEffect, useState } from 'react';

interface NewPostAlertProps {
  latestPostPubDateStr: string | null;
}

const NewPostAlert: React.FC<NewPostAlertProps> = ({ latestPostPubDateStr }) => {
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (!latestPostPubDateStr) {
      setShowAlert(false);
      return;
    }

    const latestPostDate = new Date(latestPostPubDateStr);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    setShowAlert(latestPostDate > sevenDaysAgo);
  }, [latestPostPubDateStr]);

  if (!showAlert) return null;

  return (
    <span className="relative flex h-3 w-3">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
    </span>
  );
};

export default NewPostAlert;
