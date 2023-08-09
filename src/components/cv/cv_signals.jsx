import { createSignal } from 'solid-js';

const [cvElems, setCvElems] = createSignal(
  JSON.parse(localStorage.getItem('cvElements')) || {}
);

export const useCvElems = () => [cvElems, setCvElems];
