import ExperienceItem from './experience_item.jsx';
import ExperienceForm from './experience_form.jsx';
import FieldForm from './field_form.jsx';
import Title from './title.jsx';
import SortableItem from './sortable_item.jsx';
import React, { useEffect, useState } from 'react';
import { useCvElems } from './cv_signals.jsx';

export default function Elements(props) {
  const [cvElements, setCvElements] = useState(null);
  const [cvElems, setCvElems] = useCvElems();

  useEffect(() => {
    readElements();
  }, [])

  function readElements() {
    let elements = localStorage.getItem("cvElements");
    if (elements === null) {
      const defaultElements = {}
      localStorage.setItem("cvElements", JSON.stringify(defaultElements));
    } else {
      elements = JSON.parse(elements);
      setCvElems(elements);
    }
    console.log(cvElems);
    setCvElements(elements);
  }

  function setSelected(args) {
    const obj = args[0];
    const key = args[1];
    let update = {...cvElems};
    let idx = update[key].findIndex(i => i.title == obj.title);
    update[key][idx]["selected"] = !update[key][idx].selected;
    setCvElems(update);
  }

  return (
    <div>
      <FieldForm />
      {cvElems != null ? (
        Object.keys(cvElems).map((key) => (
          <div key={key}>
            {cvElems[key] != [] ? (
              <>
                <Title title={key} />
                <ExperienceForm key={key} />
                {cvElems[key] && cvElems[key].map((obj, i) => (
                  <div key={i}>
                    <SortableItem key={key} obj={obj} />
                  </div>
                ))}
              </>
            ) : (
              <ExperienceForm key={key} />
            )}
          </div>
        ))
      ) : (
        <div></div>
      )}
    </div>
  )
}
