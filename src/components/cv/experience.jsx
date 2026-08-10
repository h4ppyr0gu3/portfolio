import React from 'react';
import Title from './title';
import ExperienceItem from './experience_item';

export default function Experience(props) {
  const { experience, title } = props;

  if (!experience?.length) {
    return null;
  }

  return (
    <Title title={title}>
      <div className="cv-experience-list flex flex-col gap-4">
        {experience.map((xp, i) => (
          <ExperienceItem key={i} experience={xp} parent={title} />
        ))}
      </div>
    </Title>
  );
}
