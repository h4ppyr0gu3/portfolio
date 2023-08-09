import ExperienceItem from './experience_item.jsx';
import ExperienceForm from './experience_form.jsx';
import { useCvElems } from './cv_signals.jsx';
import { createSignal, Show } from 'solid-js';

export default function SortableItem(props) {
  const key = props.key;
  const obj = props.obj;
  const i = props.i;

  const [cvElems, setCvElems] = useCvElems();
  const [edit, setEdit] = createSignal(false);

  function setSelected(args) {
    const obj = args[0];
    const key = args[1];
    let idx = cvElems()[key].findIndex(i => i.title == obj.title)
    let update = {
      ...cvElems(),
[key]: cvElems()[key].map((item, i) =>
        i === idx ? {
              ...item,
              selected: !item.selected,
            } : item
      ),
    };
    setCvElems(update);
  }

  return (
    <div class={`border p-6 m-3 rounded border-gray-500 ${obj.selected == true ? 'border-sky-400' : 'border-gray-400'}`} >
      <div class="flex justify-between -mt-3">
        <button class="bg-sky-400 p rounded px-2 text-black" onClick={[setSelected, [obj, key]]}>Select</button>
        <button class="bg-sky-400 p rounded px-2 text-black" onClick={() => setEdit(!edit())}>Edit</button>
      </div>
      <Show when={edit()} fallback={<ExperienceItem experience={obj} />}>
        <ExperienceForm xp={obj} />
      </Show>
    </div>
  )
}
