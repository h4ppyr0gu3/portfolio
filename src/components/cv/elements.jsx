import Experience from './experience.jsx';
import ExperienceForm from './experience_form.jsx';
import FieldForm from './field_form.jsx';
import { onMount, For, Show, createSignal, createEffect } from 'solid-js';
import { useCvElems } from './cv_store.jsx';

export default function Elements(props) {
  const [cvElements, setCvElements] = createSignal(null)
  const [cvElems, setCvElems] = useCvElems();

  createEffect(() => {
    console.log(Object.keys(cvElems));
    setCvElements(cvElems);
  })

  onMount(() => {
    readElements();
  })

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

  return (
    <div>
      <Show
        when={cvElements() != null}
        fallback={<div>Loading...</div>}
      >
        <For each={Object.keys(cvElems)}>{(key, i) =>
          <div>
            <div>{key}</div>
            <div>{i}</div>
          </div>
        }</For>
        <div>"testing"</div>
      </Show>
      <FieldForm />
    </div>
  )
}
