/** @typedef {'about' | 'skills' | 'experience' | 'education' | 'custom'} SectionType */

let _id = 0;
export function uid(prefix = 'id') {
  _id += 1;
  return `${prefix}-${Date.now().toString(36)}-${_id}`;
}

export function emptyItem() {
  return {
    id: uid('item'),
    selected: true,
    title: '',
    company: '',
    start: '',
    end: '',
    location: '',
    description: '',
    skills: [],
  };
}

export function emptyContact() {
  return { id: uid('contact'), label: '', value: '', href: '' };
}

export function emptySection(type = 'custom', title = 'New section') {
  return {
    id: uid('section'),
    title,
    type,
    items: [],
  };
}

export function emptyDocument() {
  return {
    meta: {
      name: '',
      role: '',
      photoUrl: '',
      contact: [],
      isExample: false,
    },
    sections: [
      emptySection('about', 'About Me'),
      emptySection('skills', 'Skills Summary'),
      emptySection('experience', 'Experience'),
      emptySection('education', 'Education'),
    ],
  };
}

const DEFAULT_CONTACT = [
  { label: 'Phone', value: '+48516809024', href: 'tel:+48516809024' },
  { label: 'Email', value: 'rogersdpdr@gmail.com', href: 'mailto:rogersdpdr@gmail.com' },
  { label: 'GitHub', value: 'h4ppyr0gu3', href: 'https://github.com/h4ppyr0gu3' },
  { label: 'Twitter', value: 'h4ppyr0gu3', href: 'https://twitter.com/h4ppyr0gu3' },
  { label: 'LinkedIn', value: 'David Rogers', href: 'https://www.linkedin.com/in/david-pj-rogers' },
];

function mapXp(item) {
  return {
    ...emptyItem(),
    selected: item.selected !== false,
    title: item.title || '',
    company: item.company || '',
    start: item.start || '',
    end: item.end || '',
    location: item.location || '',
    description: item.description || '',
    skills: Array.isArray(item.skills) ? [...item.skills] : [],
  };
}

/** Convert site cv.json (+ defaults) into a cvDocument. */
export function seedFromSiteCv(cv) {
  const doc = emptyDocument();
  doc.meta = {
    name: 'David Rogers',
    role: 'Ruby on Rails | Web Developer',
    photoUrl: '/portfolio.jpeg',
    contact: DEFAULT_CONTACT.map((c) => ({ ...emptyContact(), ...c })),
    isExample: true,
  };

  doc.sections = [
    {
      ...emptySection('about', 'About Me'),
      items: (cv?.aboutMe || []).map((paragraph) => ({
        ...emptyItem(),
        description: paragraph,
      })),
    },
    {
      ...emptySection('skills', 'Skills Summary'),
      items: (cv?.skills || []).map((skill) => ({
        ...emptyItem(),
        title: skill,
      })),
    },
    {
      ...emptySection('experience', 'Experience'),
      items: (cv?.experience || []).map(mapXp),
    },
    {
      ...emptySection('education', 'Education'),
      items: (cv?.education || []).map(mapXp),
    },
  ];

  return doc;
}

/** Migrate legacy `{ "Section": [items] }` shape to cvDocument. */
export function migrateLegacyElements(legacy, siteCv) {
  if (!legacy || typeof legacy !== 'object' || Array.isArray(legacy)) {
    return seedFromSiteCv(siteCv);
  }
  if (legacy.meta && Array.isArray(legacy.sections)) {
    return normalizeDocument(legacy);
  }

  const keys = Object.keys(legacy);
  if (!keys.length) return seedFromSiteCv(siteCv);

  const doc = emptyDocument();
  doc.meta = {
    name: 'David Rogers',
    role: 'Ruby on Rails | Web Developer',
    photoUrl: '/portfolio.jpeg',
    contact: DEFAULT_CONTACT.map((c) => ({ ...emptyContact(), ...c })),
    isExample: true,
  };

  doc.sections = keys.map((title) => {
    const lower = title.toLowerCase();
    let type = 'custom';
    if (/about/.test(lower)) type = 'about';
    else if (/skill/.test(lower)) type = 'skills';
    else if (/educat/.test(lower)) type = 'education';
    else if (/experience|work|job/.test(lower)) type = 'experience';

    const raw = Array.isArray(legacy[title]) ? legacy[title] : [];
    return {
      ...emptySection(type, title),
      items: raw.map((item) => {
        if (type === 'skills' && typeof item === 'object') {
          return { ...emptyItem(), selected: item.selected !== false, title: item.title || '' };
        }
        if (type === 'about' && typeof item === 'object') {
          return {
            ...emptyItem(),
            selected: item.selected !== false,
            description: item.description || '',
          };
        }
        return mapXp(item || {});
      }),
    };
  });

  return doc;
}

export function normalizeDocument(doc) {
  if (!doc || typeof doc !== 'object') return emptyDocument();
  const meta = doc.meta || {};
  return {
    meta: {
      name: meta.name || '',
      role: meta.role || '',
      photoUrl: meta.photoUrl || '',
      contact: Array.isArray(meta.contact)
        ? meta.contact.map((c) => ({
            id: c.id || uid('contact'),
            label: c.label || '',
            value: c.value || '',
            href: c.href || '',
          }))
        : [],
      isExample: Boolean(meta.isExample),
    },
    sections: Array.isArray(doc.sections)
      ? doc.sections.map((s) => ({
          id: s.id || uid('section'),
          // Preserve empty string while typing; only fall back when title is missing.
          title: typeof s.title === 'string' ? s.title : 'Section',
          type: s.type || 'custom',
          items: Array.isArray(s.items)
            ? s.items.map((item) => ({
                ...emptyItem(),
                ...item,
                id: item.id || uid('item'),
                skills: Array.isArray(item.skills) ? item.skills : [],
                selected: item.selected !== false,
              }))
            : [],
        }))
      : emptyDocument().sections,
  };
}

export function moveInArray(arr, from, to) {
  if (to < 0 || to >= arr.length) return arr;
  const next = [...arr];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}
