import ExperienceItem from './experience_item.jsx';
import { useCvElems } from './cv_signals.jsx';

export default function SortableItem(props) {
  const key = props.key;
  const obj = props.obj;
  const i = props.i;

  const [cvElems, setCvElems] = useCvElems();

  function setSelected(args) {
    const obj = args[0];
    const key = args[1];
    let update = cvElems();
    let idx = update[key].findIndex(i => i.title == obj.title)
    update[key][idx]["selected"] = !update[key][idx].selected;
    setCvElems(update)
  }

  return (
    <div class={`border p-6 m-3 rounded border-gray-500 hover:cursor-pointer ${obj.selected == true ? 'border-sky-400' : 'border-gray-400'}`} onClick={[setSelected, [obj, key, i]]} >
      <ExperienceItem experience={obj} />
    </div>
  )
}
