import Skills from "./skills";
import Title from "./title";
import { Show } from "solid-js";
export default function Experience(props) {
  const experience = props.experience

  return (
    <Title title={props.title}>
      <For each={experience}>{(xp, i) =>
        <li class="mt-5">
          <div class="flex justify-between">
            <div>
              <span class="font-bold text-xl">{xp.title}</span> -
              <span class="font-bold text-lg"> {xp.company} </span>
              <div class="text-sm text-gray-400">{xp.start} - {xp.end}</div>
            </div>
            <div class="text-gray-400">{xp.location}</div>
          </div>
          <hr class="my-2 dark:border-gray-500 border border-gray-300" />
          <div class="px-3 py-2">{xp.description}</div>
          <Show when={props.title == "Experience"} fallback={
            <strong class="text-lg font-semibold">Grades</strong>
          }>
            <strong class="text-lg font-semibold">Skills</strong>
          </Show>
          <div class="px-3">
            <Skills skills={xp.skills} />
          </div>
        </li>
      }</For>
    </Title>
  );
}
