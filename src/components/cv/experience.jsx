import Skills from "./skills";
import Title from "./title";
import ExperienceItem from "./experience_item";
import { Show } from "solid-js";
export default function Experience(props) {
  const experience = props.experience

  return (
    <Title title={props.title}>
      <For each={experience}>{(xp, i) =>
        <ExperienceItem experience={xp} parent={props.title} />
      }</For>
    </Title>
  );
}
