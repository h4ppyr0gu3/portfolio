import React from 'react';

export default function ExperienceItem(props) {
  const { experience: xp, parent } = props;

  if (!xp) return null;

  const skills = Array.isArray(xp.skills) ? xp.skills.filter(Boolean) : [];
  const skillLabel =
    parent === 'Experience'
      ? 'Skills'
      : parent === 'Education'
        ? 'Grades'
        : parent?.includes?.('Skill')
          ? null
          : skills.length
            ? 'Skills'
            : null;

  const hasHeading = Boolean(xp.title || xp.company);
  const hasBody = Boolean(xp.description) || (skills.length > 0 && skillLabel);
  const hasLooseSkills = skills.length > 0 && !skillLabel && !hasHeading;

  return (
    <div className="cv-experience-item">
      {hasHeading ? (
        <div className="cv-experience-head">
          <h3 className="cv-experience-title">
            {xp.title}
            {xp.company ? (
              <span className="cv-experience-company"> — {xp.company}</span>
            ) : null}
          </h3>
          {(xp.start || xp.end || xp.location) ? (
            <p className="cv-experience-meta">
              {[xp.start && xp.end ? `${xp.start} – ${xp.end}` : xp.start || xp.end, xp.location]
                .filter(Boolean)
                .join(' · ')}
            </p>
          ) : null}
        </div>
      ) : null}
      {hasBody ? (
        <div className="cv-experience-body">
          {xp.description ? <p className="cv-experience-desc">{xp.description}</p> : null}
          {skills.length > 0 && skillLabel ? (
            <p className="cv-experience-skills">
              <span className="cv-experience-skills-label">{skillLabel}: </span>
              {skills.join(', ')}
            </p>
          ) : null}
        </div>
      ) : null}
      {hasLooseSkills ? <p className="cv-skills">{skills.join(' · ')}</p> : null}
    </div>
  );
}
