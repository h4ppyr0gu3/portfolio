import React, { createContext, useState, useContext, useEffect } from 'react';

const CvContext = createContext();

export function CvProvider({ children }) {
  const [cvElems, setCvElems] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedData = localStorage.getItem('cvElements');
      return storedData ? JSON.parse(storedData) : {};
    }
    return {};
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cvElements', JSON.stringify(cvElems));
    }
  }, [cvElems]);

  return (
    <CvContext.Provider value={{ cvElems, setCvElems }}>
      {children}
    </CvContext.Provider>
  );
}

export function useCvElems() {
  const context = useContext(CvContext);
  if (!context) {
    throw new Error('useCvElems must be used within a CvProvider');
  }
  return [context.cvElems, context.setCvElems];
}
