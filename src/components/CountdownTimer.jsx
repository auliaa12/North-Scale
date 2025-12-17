import { useState, useEffect } from 'react';

const CountdownTimer = ({ targetDate }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const formatNumber = (num) => {
    return String(num).padStart(2, '0');
  };

  return (
    <div className="flex items-center gap-3">
      <div className="text-center">
        <div className="bg-white rounded-lg px-3 py-2 min-w-[60px]">
          <div className="text-2xl font-bold text-gray-800">
            {formatNumber(timeLeft.days || 0)}
          </div>
          <div className="text-xs text-gray-600">Days</div>
        </div>
      </div>
      <div className="text-2xl font-bold">:</div>
      <div className="text-center">
        <div className="bg-white rounded-lg px-3 py-2 min-w-[60px]">
          <div className="text-2xl font-bold text-gray-800">
            {formatNumber(timeLeft.hours || 0)}
          </div>
          <div className="text-xs text-gray-600">Hours</div>
        </div>
      </div>
      <div className="text-2xl font-bold">:</div>
      <div className="text-center">
        <div className="bg-white rounded-lg px-3 py-2 min-w-[60px]">
          <div className="text-2xl font-bold text-gray-800">
            {formatNumber(timeLeft.minutes || 0)}
          </div>
          <div className="text-xs text-gray-600">Minutes</div>
        </div>
      </div>
      <div className="text-2xl font-bold">:</div>
      <div className="text-center">
        <div className="bg-white rounded-lg px-3 py-2 min-w-[60px]">
          <div className="text-2xl font-bold text-gray-800">
            {formatNumber(timeLeft.seconds || 0)}
          </div>
          <div className="text-xs text-gray-600">Seconds</div>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;


