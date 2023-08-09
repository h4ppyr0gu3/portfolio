import { useCvElems } from './cv_signals.jsx';
import { createSignal, createEffect, Show } from 'solid-js';

export default function Export() {
  let [cvElems, setCvElems] = useCvElems();
  let [dropDown, setDropDown] = createSignal(false);

  function writeLocal(e) {
    e.preventDefault();
    localStorage.setItem('cvElements', JSON.stringify(cvElems()));
    setDropDown(false);
  }

  function resetLocal(e) {
    e.preventDefault();
    localStorage.removeItem('cvElements');
    setCvElems({});
    setDropDown(false);
  }

  return (
    <div class="px-4 w-1/2">
      <div onClick={() => setDropDown(!dropDown())}class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Options
      </div>
      <Show when={dropDown()}>
        <div class="relative w-full">
          <div class="absolute top-0 right-0">
            <div class="bg-neutral-900 border border-gray-300 rounded">
              <button onClick={writeLocal} class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full">
                Save to Local
              </button>
              <button onClick={resetLocal} class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full">
                Reset
              </button>
            </div>
          </div>
        </div>
      </Show>
    </div>
  )

}
