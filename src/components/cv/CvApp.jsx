import React from 'react';
import { CvProvider } from './cv_signals';
import Elements from './elements.jsx';
import Preview from './preview.jsx';
import Export from './export.jsx';

export default function CvApp() {
  return (
    <CvProvider>
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/2">
          <Elements />
        </div>
        <div className="w-full md:w-1/2">
          <Preview />
          <Export />
        </div>
      </div>
    </CvProvider>
  );
}
