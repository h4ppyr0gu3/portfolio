import { useCvElems } from './cv_signals.jsx';
import React, { useState, useEffect } from 'react';

export default function Export() {
  let [cvElems, setCvElems] = useCvElems();
  const [dropDown, setDropDown] = useState(false);

  function writeLocal(e) {
    e.preventDefault();
    localStorage.setItem('cvElements', JSON.stringify(cvElems));
    setDropDown(false);
  }

  function resetLocal(e) {
    e.preventDefault();
    localStorage.removeItem('cvElements');
    setCvElems({});
    setDropDown(false);
  }

  return (
    <div className="px-4 w-1/2">
      <div onClick={() => setDropDown(!dropDown)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Options
      </div>
      {dropDown && (
        <div className="relative w-full">
          <div className="absolute top-0 right-0">
            <div className="bg-neutral-900 border border-gray-300 rounded">
              <button onClick={writeLocal} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full">
                Save to Local
              </button>
              <button onClick={resetLocal} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full">
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )

}
