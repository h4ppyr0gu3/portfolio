import { children } from "solid-js";
export default function Title(props) {
  return (
    <div class="flex sm:flex-row flex-col">
      <h1 class="font-bold text-3xl px-3 mx-3 w-full sm:w-1/3 block">{props.title}</h1>
      <div class="w-full mb-5">
        { children(() => props.children) }
      </div>
    </div>
  )
}
