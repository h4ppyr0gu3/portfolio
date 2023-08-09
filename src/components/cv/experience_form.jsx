import Title from './title.jsx';
import { useCvElems } from './cv_signals.jsx';
import { onMount } from 'solid-js';

export default function ExperienceForm(props) {
  let titleField, companyField, startField, endField, locationField, descriptionField;
  let [cvElems, setCvElems] = useCvElems();

  onMount(() => {
    console.log("mounting");
    if (props.xp == undefined) {
      return 
    }
    if (props.xp != {} && props.xp.title != undefined) {
      titleField.value = props.xp.title;
      companyField.value = props.xp.company;
      startField.value = props.xp.start;
      endField.value = props.xp.end;
      locationField.value = props.xp.location;
      descriptionField.value = props.xp.description;
    }
  })

  function xp() {
    return {
      title: titleField.value,
      company: companyField.value,
      start: startField.value,
      end: endField.value,
      location: locationField.value,
      description: descriptionField.value
    }
  }

  function addItem(e) {
    e.preventDefault();
    let fieldArray = [...cvElems()[props.key], xp()];
    console.log(fieldArray);
    setCvElems({ ...cvElems(), [props.key]: fieldArray });
    titleField.value = '';
    companyField.value = '';
    startField.value = '';
    endField.value = '';
    locationField.value = '';
    descriptionField.value = '';
  }

  return (
    <>
      <form onSubmit={addItem}>
        <div class="mt-5">
          <div class="flex justify-between">
            <div>
              <span class="font-bold text-lg">
                <input ref={titleField} type="text" name="title" class="text-gray-900 border-b border-gray-300 bg-transparent dark:border-gray-600 dark:placeholder-gray-400 dark:text-white border-b focus:outline-none dark:focus:border-sky-400 focus:border-sky-500 w-2/5" placeholder="Add Your Title"/>
              </span> -
              <span class="font-bold text-md"> 
                <input ref={companyField} type="text" name="company" class="text-gray-900 border-b border-gray-300 bg-transparent dark:border-gray-600 dark:placeholder-gray-400 dark:text-white border-b focus:outline-none dark:focus:border-sky-400 focus:border-sky-500 w-2/5" placeholder="Add a Company"/>
              </span>
              <div class="text-sm text-gray-400">
                <input ref={startField} type="text" name="start_date" class="border-b border-gray-300 bg-transparent text-gray-400 dark:border-gray-600 border-b focus:outline-none dark:focus:border-sky-400 focus:border-sky-500 text-sm w-1/4" placeholder="From..."/>
                -
                <input ref={endField} type="text" name="end_date" class="text-sm border-b border-gray-300 bg-transparent text-gray-400 dark:border-gray-600 border-b focus:outline-none dark:focus:border-sky-400 focus:border-sky-500 w-1/4" placeholder="...To"/>
              </div>
            </div>
            <div>
              <input ref={locationField} type="text" name="search" class="border-b border-gray-300 bg-transparent text-gray-400 border-b focus:outline-none dark:border-gray-600 dark:focus:border-sky-400 focus:border-sky-500 w-full" placeholder="Location"/>
            </div>
          </div>
          <hr class="my-2 dark:border-gray-500 border border-gray-300" />
          <div class="px-3 py-2">{xp.description}
            <textarea ref={descriptionField} name="description" class="border-b border-gray-300 bg-transparent text-gray-400 border-b focus:outline-none dark:border-gray-600 dark:focus:border-sky-400 focus:border-sky-500 w-full" placeholder="Say a little about your experience in this position..."/>
          </div>
        </div>
        <button type="submit" class="dark:text-white bg-sky-400 hover:bg-sky-700 font-medium rounded-lg text-sm px-4 py-2 dark:bg-sky-500 dark:hover:bg-sky-700 " onClick={addItem}>Add Entry</button>
      </form>
    </>
  )
}
