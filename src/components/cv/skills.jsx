import React from 'react';

export default function Skills(props) {
  const { skills } = props;

  if (!skills || skills.length === 0) {
    return null;
  }

  return (
    <ul className="cv-skills-grid">
      {skills.map((skill, i) => (
        <li key={i}>{skill}</li>
      ))}
    </ul>
  );
}
