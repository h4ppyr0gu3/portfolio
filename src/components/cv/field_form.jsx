import { useCvElems } from "./cv_signals";

export default function FieldForm() {
  let titleField
  const [cvElems, setCvElems] = useCvElems();
  function handleCreate(e) {
    e.preventDefault();
    setCvElems({...cvElems(), [titleField.value]: []})
    titleField.value = "";  
  }

  function debug() {
    console.log(titleField.value);
    console.log(cvElems());
  }

  return (
    <div>
      <button onClick={debug}>debug</button>
    <form onSubmit={handleCreate} class="flex justify-center items-center mb-2">
      <input ref={titleField} type="search" name="search" class="block text-lg text-gray-900 border-b border-gray-300 bg-transparent dark:border-gray-600 dark:placeholder-gray-400 dark:text-white border-b focus:outline-none dark:focus:border-sky-400 focus:border-sky-500 w-full m-8 " placeholder="Add A Field..."/>
    </form>
    </div>
    
  );
}
