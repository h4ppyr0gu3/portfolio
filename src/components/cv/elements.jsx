import ExperienceItem from './experience_item.jsx';
import ExperienceForm from './experience_form.jsx';
import FieldForm from './field_form.jsx';
import Title from './title.jsx';
import SortableItem from './sortable_item.jsx';
import { onMount, For, Show, createSignal, createEffect } from 'solid-js';
import { useCvElems } from './cv_signals.jsx';
import { unwrap } from 'solid-js/store';

export default function Elements(props) {
  const [cvElements, setCvElements] = createSignal(null);
  const [cvElems, setCvElems] = useCvElems();

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

  function setSelected(args) {
    const obj = args[0];
    const key = args[1];
    let update = cvElems();
    let idx = update[key].findIndex(i => i.title == obj.title)
    update[key][idx]["selected"] = !update[key][idx].selected;
    setCvElems(cvElems()[key][idx]["selected"] = update[key][idx].selected);
  }

  return (
    <div>
      <FieldForm />
      <Show
        when={cvElems() != null}
        fallback={<div></div>}
      >
        <For each={Object.keys(cvElems())}>{(key) =>
          <div>
            <Show when={cvElems()[key] != []} fallback={ <ExperienceForm key={key} /> }>
              <Title title={key} />
              <ExperienceForm key={key} />
              <For each={cvElems()[key]}>{(obj, i) =>
                <div>
                  <SortableItem key={key} obj={obj} />
                </div>
              }</For>
            </Show>
          </div>
        }</For>
      </Show>
    </div>
  )
}
