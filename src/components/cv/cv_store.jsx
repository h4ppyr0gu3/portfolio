import { createStore, unwrap, reconcile } from 'react';

const [cvElems, setCvElems] = createStore(
  JSON.parse(localStorage.getItem('cvElements')) || {}
);

export const useCvElems = () => [cvElems, setCvElems];
export const addField = (text) => {
  let v = unwrap(cvElems);
  v[text] = {};
  setCvElems(reconcile(v));
}
export const addEntry = (field, obj) => {
  setCvElems(cvElems[field] = [...cvElems()[field], obj]);
}
const updateEntry = 1;

