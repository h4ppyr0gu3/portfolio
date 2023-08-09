import Skills from "./skills";
import Title from "./title";
import { Show } from "solid-js";
export default function ExperienceItem(props) {
  let xp = props.experience
  let skillName;
  if (xp !== undefined) {
    if (xp.skillName !== undefined) {
      console.log(skillName);
      skillName = xp.skillName
    } else {
      if (props.parent == "Experience") {
        skillName = "Skills"
      } else if (props.parent == "Education") {
        skillName = "Grades"
      }
    }
  }

  return (
    <li class="mt mb-3">
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
      <strong class="text-lg font-semibold">{skillName}</strong>
      <div class="px-3">
        <Skills skills={xp.skills} />
      </div>
    </li>
  );
}
