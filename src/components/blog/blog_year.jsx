import React, { useState, useEffect } from 'react';

export default function BlogYear({item, index, store}) {
  const [presence, setPresence] = useState(false);

  function parseDate(string) {
    const [day, month, year] = string.split('/').map((part) => parseInt(part, 10));
    return new Date(year, month - 1, day); // months are zero-based in JS
  }

  function getYear(string) {
    const [_day, _month, year] = string.split('/').map((part) => parseInt(part, 10));
    return year;
  }

  useEffect(() => {
    if (index === 0) { setPresence(true); }
    else if (getYear(item.date) !== getYear(store[index - 1].date)) { 
      setPresence(true); 
    }
  }, [])

  return (
    <>
      { presence ? (
        <li class="text-xl font-bold text-sky-400 flex justify-center content-center">{getYear(item.date)}</li>
      )
        : <div></div>
      }
    </>
  )
}
