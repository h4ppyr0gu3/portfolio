import { createStore } from 'solid-js/store';

const [cvElems, setCvElems] = createStore(
  JSON.parse(localStorage.getItem('cvElements')) || {}
);

export const useCvElems = () => [cvElems, setCvElems];
export const addField = (text) => {
  let v = Object.duplicate(cvElems);
  setCvElems(cvElems[text] = {});
}
export const addEntry = (field, obj) => {
  setCvElems(cvElems[field] = [...cvElems()[field], obj]);
}
const updateEntry = 1;

