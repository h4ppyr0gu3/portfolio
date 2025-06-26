import { useCvElems } from './cv_signals';
import React, { useEffect } from 'react';
import ExperienceItem from './experience_item.jsx';
import Title from './title.jsx';

export default function Preview() {
  const [cvElems, setCvElems] = useCvElems();

  useEffect(() => {
    readElements();
  }, []);

  function readElements() {
    let elements = localStorage.getItem("cvElements");
    if (elements === null) {
      const defaultElements = {}
      localStorage.setItem("cvElements", JSON.stringify(defaultElements));
    } else {
      elements = JSON.parse(elements);
      setCvElems(elements);
    }
    console.log(cvElems && Object.keys(cvElems));
  }

  return (
    <div>
      <div id="cv-preview" className="my-3 mx-8 bg-white dark:bg-neutral-800 text-black dark:text-white p-6 rounded shadow-lg transition-colors duration-200">
        {cvElems != null && (
          Object.keys(cvElems).map((key) => (
            <div key={key}>
              <Title title={key} />
              {cvElems[key] != [] && (
                cvElems[key] && cvElems[key].map((obj, i) => (
                  obj.selected && (
                    <div key={i}>
                      <ExperienceItem parent={key} experience={obj} />
                    </div>
                  )
                ))
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
