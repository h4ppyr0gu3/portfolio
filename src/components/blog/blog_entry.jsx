import React from 'react';

export default function BlogEntry({ href, title, excerpt, date, tags }) {
  return (
    <li className="flex justify-center content-center">
      <h5 className="group text-2xl text-gray-900 dark:text-white p w-fit">
        <a href={href}>
          <span className="hover:underline font-semibold" title={excerpt}>
            {title}
          </span>
        </a>
      </h5>
    </li>
  );
}
