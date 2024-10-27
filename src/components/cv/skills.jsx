import React from 'react';
import Title from './title';

export default function Skills(props) {
  const { skills } = props;
  
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
      {skills.map((skill, i) => (
        <div key={i}>{skill}</div>
      ))}
    </div>
  );
}
