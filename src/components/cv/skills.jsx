import Title from "./title";
export default function Skills(props) {
  const skills = props.skills
  return (
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
      <For each={skills}>{(skill, i) =>
        <div key={i}>{skill}</div>
      }</For>
    </div>
  )
}
