import React from 'react';

export default function List({ til }) {
  return (
    <div>
      <ul>
        {til.length > 0 ? (
          til.map((item, index) => (
            <li
              key={index}
              className="flex justify-center content-center grid-cols-1"
              onClick={() => {}}
            >
              {(index === 0 || til[index].topics !== til[index - 1].topics) && (
                <p className="text-xl font-bold text-sky-400 flex justify-center content-center">
                  {til[index].topics}
                </p>
              )}
              <h5 className="group text-2xl text-gray-900 dark:text-white w-fit">
                <a href={item.href} title={item.excerpt}>
                  <span className="hover:underline font-semibold">{item.title}</span>
                </a>
              </h5>
            </li>
          ))
        ) : (
          <div>Nothing Learnt today</div>
        )}
      </ul>
    </div>
  );
}
