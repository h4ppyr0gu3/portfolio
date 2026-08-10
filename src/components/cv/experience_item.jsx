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
    <div className="cv-experience-item mb-3">
      {hasHeading ? (
        <div className="cv-experience-head">
          <h3 className="cv-experience-title m-0 text-xl font-bold leading-snug">
            {xp.title}
            {xp.company ? (
              <span className="cv-experience-company font-semibold opacity-75">
                {' '}
                — {xp.company}
              </span>
            ) : null}
          </h3>
          {(xp.start || xp.end || xp.location) ? (
            <p className="cv-experience-meta m-0 text-sm opacity-60">
              {[xp.start && xp.end ? `${xp.start} – ${xp.end}` : xp.start || xp.end, xp.location]
                .filter(Boolean)
                .join(' · ')}
            </p>
          ) : null}
        </div>
      ) : null}
      {hasBody ? (
        <div className="cv-experience-body mt-1">
          {xp.description ? (
            <p className="cv-experience-desc m-0 text-base leading-relaxed">{xp.description}</p>
          ) : null}
          {skills.length > 0 && skillLabel ? (
            <p className="cv-experience-skills mt-1 text-sm opacity-80">
              <span className="cv-experience-skills-label font-bold opacity-100">
                {skillLabel}:{' '}
              </span>
              {skills.join(', ')}
            </p>
          ) : null}
        </div>
      ) : null}
      {hasLooseSkills ? (
        <p className="cv-skills m-0 text-base opacity-80">{skills.join(' · ')}</p>
      ) : null}
    </div>
  );
}
