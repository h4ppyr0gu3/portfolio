import React from 'react';
import Skills from './skills';
import Title from './title';
import ExperienceItem from './experience_item';

export default function Experience(props) {
  const { experience, title } = props;

  return (
    <Title title={title}>
      {experience.map((xp, i) => (
        <ExperienceItem key={i} experience={xp} parent={title} />
      ))}
    </Title>
  );
}
