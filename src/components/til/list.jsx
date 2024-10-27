import React from 'react';

export default function List({ til }) {
  return (
    <div>
      <ul>
        {til.length > 0 ? (
          til.map((item, index) => (
            <>
            {(index === 0 || til[index].topics !== til[index - 1].topics) && (
              <li key={til[index].topics} className="text-xl font-bold text-sky-400 flex justify-center content-center">
                {til[index].topics}
              </li>
            )}
              <li key={index} className="flex justify-center content-center grid-cols-1" >
              <h5 className="group text-2xl text-gray-900 dark:text-white w-fit">
                <a href={item.href} title={item.excerpt}>
                  <span className="hover:underline font-semibold">{item.title}</span>
                </a>
              </h5>
              </li>
            </>
          ))
        ) : (
              <li key="nothing" className="flex justify-center content-center grid-cols-1">
              <h5 className="group text-2xl text-gray-500 dark:text-gray-500 w-fit">
                  <span className="hover:underline font-semibold">Nothing learnt here</span>
              </h5>
            </li>
          )}
      </ul>
    </div>
  );
}
