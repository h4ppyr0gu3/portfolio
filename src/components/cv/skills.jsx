import React from 'react';

export default function Skills(props) {
  const { skills } = props;

  if (!skills || skills.length === 0) {
    return null;
  }

  return (
    <ul className="cv-skills-grid m-0 grid list-none grid-cols-2 gap-x-3 gap-y-1 p-0 sm:grid-cols-3 md:grid-cols-4">
      {skills.map((skill, i) => (
        <li key={i} className="list-none">
          {skill}
        </li>
      ))}
    </ul>
  );
}
