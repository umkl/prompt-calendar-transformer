import { useEffect, useState } from "react";

export default function useCalendarDayView() {
  const [day, setDay] = useState(new Date());
  function nextDay() {
    setDay((prev) => {
      const next = new Date(prev);
      next.setDate(next.getDate() + 1);
      return next;
    });
  }
  function prevDay() {
    setDay((prev) => {
      const next = new Date(prev);
      next.setDate(next.getDate() - 1);
      return next;
    });
  }
  useEffect(() => {}, []);
  return {
    day,
    nextDay,
    prevDay,
  };
}
