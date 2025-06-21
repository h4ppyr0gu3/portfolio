import { useCvElems } from "./cv_signals";
import React, { useRef } from "react";

export default function FieldForm() {
  const titleField = useRef(null);
  const [cvElems, setCvElems] = useCvElems();
  
  function handleCreate(e) {
    e.preventDefault();
    if (titleField.current && titleField.current.value) {
      setCvElems({...cvElems, [titleField.current.value]: []});
      titleField.current.value = "";
    }
  }

  function debug() {
    console.log(titleField.current?.value);
    console.log(cvElems);
  }

  return (
    <div>
      <button onClick={debug}>debug</button>
    <form onSubmit={handleCreate} className="flex justify-center items-center mb-2">
      <input ref={titleField} type="search" name="search" className="block text-lg text-gray-900 border-b border-gray-300 bg-transparent dark:border-gray-600 dark:placeholder-gray-400 dark:text-white border-b focus:outline-none dark:focus:border-sky-400 focus:border-sky-500 w-full m-8 " placeholder="Add A Field..."/>
    </form>
    </div>
    
  );
}
