import Skills from "./skills";
import Title from "./title";
import React from 'react';

export default function ExperienceItem(props) {
  const { experience: xp, parent } = props;
  let skillName;

  if (xp) {
    if (xp.skillName) {
      console.log(xp.skillName);
      skillName = xp.skillName;
    } else {
      skillName = parent === "Experience" ? "Skills" : parent === "Education" ? "Grades" : undefined;
    }
  }

  return (
    <li className="mt mb-3">
      <div className="flex justify-between">
        <div>
          <span className="font-bold text-xl">{xp?.title}</span> -
          <span className="font-bold text-lg"> {xp?.company} </span>
          <div className="text-sm text-gray-400">
            {xp?.start} - {xp?.end}
          </div>
        </div>
        <div className="text-gray-400">{xp?.location}</div>
      </div>
      <hr className="my-2 dark:border-gray-500 border border-gray-300" />
      <div className="px-3 py-2">{xp?.description}</div>
      <strong className="text-lg font-semibold">{skillName}</strong>
      <div className="px-3">
        <Skills skills={xp?.skills} />
      </div>
    </li>
  );
}
