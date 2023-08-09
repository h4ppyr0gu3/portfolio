import { useCvElems } from './cv_signals';
import { Show, onMount } from 'solid-js';
import ExperienceItem from './experience_item.jsx';
import Title from './title.jsx';

export default function Preview() {
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
    console.log(Object.keys(cvElems()));
  }

  return (
    <div>
      <div class="my-3 mx-8">
        <Show when={cvElems() != null} >
          <For each={Object.keys(cvElems())}>{(key) =>
            <div>
              <Title title={key} />
              <Show when={cvElems()[key] != []} >
                <For each={cvElems()[key]}>{(obj, i) =>
                  <Show when={obj.selected}>
                  <div>
                    <ExperienceItem parent={key} experience={obj} />
                  </div>
                  </Show>
                }</For>
              </Show>
            </div>
          }</For>
        </Show>
      </div>
    </div>
  );
}
