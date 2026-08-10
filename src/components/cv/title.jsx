function slugify(title) {
  return String(title || 'section')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function Title(props) {
  const id = `heading-${slugify(props.title)}`;
  return (
    <section className="mb-6 flex flex-col sm:flex-row" aria-labelledby={id}>
      <h2
        id={id}
        className="mb-3 w-full px-3 text-3xl font-bold sm:mb-0 sm:w-1/3"
      >
        {props.title}
      </h2>
      <div className="mb-5 w-full min-w-0">{props.children}</div>
    </section>
  );
}
