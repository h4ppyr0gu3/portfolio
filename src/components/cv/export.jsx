import React, { useState, useEffect } from 'react';
import { useCvElems } from './cv_signals';
import html2pdf from 'html2pdf.js';

export default function Export() {
  const [cvElems, setCvElems] = useCvElems();
  const [dropDown, setDropDown] = useState(false);
  const [autoSave, setAutoSave] = useState(true);

  // Auto-save to localStorage when CV elements change
  useEffect(() => {
    if (autoSave && Object.keys(cvElems).length > 0) {
      writeLocal();
      console.log('Auto-saved CV elements to localStorage');
    }
  }, [cvElems, autoSave]);

  function writeLocal() {
    localStorage.setItem("cvElements", JSON.stringify(cvElems));
  }

  function resetLocal() {
    localStorage.removeItem("cvElements");
    setCvElems({});
  }

  function exportToPDF() {
    // Get the preview element
    const previewElement = document.querySelector('#cv-preview');
    
    if (!previewElement) {
      console.error('Preview element not found');
      return;
    }
    
    // Configure PDF options
    const options = {
      margin: 10,
      filename: 'my-cv.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    // Generate PDF
    html2pdf()
      .set(options)
      .from(previewElement)
      .save()
      .then(() => {
        console.log('PDF generated successfully');
      })
      .catch(error => {
        console.error('Error generating PDF:', error);
      });
  }

  function debug() {
    console.log(cvElems);
  }

  function exportToJSON() {
    // Create a blob with the CV data
    const data = JSON.stringify(cvElems, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    
    // Create a URL for the blob
    const url = URL.createObjectURL(blob);
    
    // Create a temporary anchor element to trigger the download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my-cv-data.json';
    
    // Append to the document, click, and remove
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
  }

  return (
    <div className="px-4 w-full md:w-1/2 mb-6">
      <div onClick={() => setDropDown(!dropDown)} className="bg-blue-500 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-800 text-white font-bold py-2 px-4 rounded cursor-pointer transition-colors duration-200">
        Options
      </div>
      {dropDown && (
        <div className="relative w-full">
          <div className="absolute top-0 right-0 z-10">
            <div className="bg-white dark:bg-neutral-900 border border-gray-300 dark:border-gray-700 rounded p-2 shadow-lg transition-colors duration-200">
              <button onClick={writeLocal} className="bg-blue-500 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-800 text-white font-bold py-2 px-4 rounded w-full mb-2 transition-colors duration-200">
                Save to Local
              </button>
              <button onClick={exportToPDF} className="bg-green-500 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-800 text-white font-bold py-2 px-4 rounded w-full mb-2 transition-colors duration-200">
                Export to PDF
              </button>
              <button onClick={exportToJSON} className="bg-purple-500 hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-800 text-white font-bold py-2 px-4 rounded w-full mb-2 transition-colors duration-200">
                Export to JSON
              </button>
              <div className="flex items-center mb-2">
                <input 
                  type="checkbox" 
                  id="autoSave" 
                  checked={autoSave} 
                  onChange={() => setAutoSave(!autoSave)} 
                  className="mr-2"
                />
                <label htmlFor="autoSave" className="text-gray-800 dark:text-gray-200 text-sm transition-colors duration-200">Auto-save changes</label>
              </div>
              <button onClick={resetLocal} className="bg-red-500 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-800 text-white font-bold py-2 px-4 rounded w-full transition-colors duration-200">
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
