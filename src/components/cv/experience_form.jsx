import Title from './title.jsx';
import { useCvElems } from './cv_signals.jsx';
import React, { useEffect, useRef } from 'react';

export default function ExperienceForm(props) {
  const titleField = useRef();
  const companyField = useRef();
  const startField = useRef();
  const endField = useRef();
  const locationField = useRef();
  const descriptionField = useRef();
  const [cvElems, setCvElems] = useCvElems();

  useEffect(() => {
    console.log("mounting");
    if (props.xp == undefined) {
      return;
    }
    if (props.xp != {} && props.xp.title != undefined) {
      if (titleField.current) titleField.current.value = props.xp.title;
      if (companyField.current) companyField.current.value = props.xp.company;
      if (startField.current) startField.current.value = props.xp.start;
      if (endField.current) endField.current.value = props.xp.end;
      if (locationField.current) locationField.current.value = props.xp.location;
      if (descriptionField.current) descriptionField.current.value = props.xp.description || '';
    }
  }, [props.xp])

  function xp() {
    return {
      selected: true,
      title: titleField.current?.value || '',
      company: companyField.current?.value || '',
      start: startField.current?.value || '',
      end: endField.current?.value || '',
      location: locationField.current?.value || '',
      description: descriptionField.current?.value || ''
    }
  }

  function addItem(e) {
    e.preventDefault();
    let fieldArray = [...(cvElems[props.key] || []), xp()];
    console.log(fieldArray);
    setCvElems({ ...cvElems, [props.key]: fieldArray });
    if (titleField.current) titleField.current.value = '';
    if (companyField.current) companyField.current.value = '';
    if (startField.current) startField.current.value = '';
    if (endField.current) endField.current.value = '';
    if (locationField.current) locationField.current.value = '';
    if (descriptionField.current) descriptionField.current.value = '';
  }

  return (
    <>
      <form onSubmit={addItem}>
        <div className="mt-5">
          <div className="flex justify-between">
            <div>
              <span className="font-bold text-lg">
                <input ref={titleField} type="text" name="title" className="text-gray-900 border-b border-gray-300 bg-transparent dark:border-gray-600 dark:placeholder-gray-400 dark:text-white border-b focus:outline-none dark:focus:border-sky-400 focus:border-sky-500 w-2/5" placeholder="Add Your Title"/>
              </span> -
              <span className="font-bold text-md"> 
                <input ref={companyField} type="text" name="company" className="text-gray-900 border-b border-gray-300 bg-transparent dark:border-gray-600 dark:placeholder-gray-400 dark:text-white border-b focus:outline-none dark:focus:border-sky-400 focus:border-sky-500 w-2/5" placeholder="Add a Company"/>
              </span>
              <div className="text-sm text-gray-400">
                <input ref={startField} type="text" name="start_date" className="border-b border-gray-300 bg-transparent text-gray-400 dark:border-gray-600 border-b focus:outline-none dark:focus:border-sky-400 focus:border-sky-500 text-sm w-1/4" placeholder="From..."/>
                -
                <input ref={endField} type="text" name="end_date" className="text-sm border-b border-gray-300 bg-transparent text-gray-400 dark:border-gray-600 border-b focus:outline-none dark:focus:border-sky-400 focus:border-sky-500 w-1/4" placeholder="...To"/>
              </div>
            </div>
            <div>
              <input ref={locationField} type="text" name="search" className="border-b border-gray-300 bg-transparent text-gray-400 border-b focus:outline-none dark:border-gray-600 dark:focus:border-sky-400 focus:border-sky-500 w-full" placeholder="Location"/>
            </div>
          </div>
          <hr className="my-2 dark:border-gray-500 border border-gray-300" />
          <div className="px-3 py-2">{xp.description}
            <textarea ref={descriptionField} name="description" className="border-b border-gray-300 bg-transparent text-gray-400 border-b focus:outline-none dark:border-gray-600 dark:focus:border-sky-400 focus:border-sky-500 w-full" placeholder="Say a little about your experience in this position..."/>
          </div>
        </div>
        <button type="submit" className="dark:text-white bg-sky-400 hover:bg-sky-700 font-medium rounded-lg text-sm px-4 py-2 dark:bg-sky-500 dark:hover:bg-sky-700 " onClick={addItem}>Add Entry</button>
      </form>
    </>
  )
}
