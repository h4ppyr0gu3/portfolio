function slugify(title) {
  return String(title || 'section')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function Title(props) {
  const id = `heading-${slugify(props.title)}`;
  return (
    <section className="cv-section" aria-labelledby={id}>
      <h2 id={id}>{props.title}</h2>
      <div className="cv-section-body">
        {props.children}
      </div>
    </section>
  );
}
