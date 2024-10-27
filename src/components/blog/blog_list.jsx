import React, { useEffect, useState } from 'react';
import BlogEntry from './blog_entry';
import BlogYear from './blog_year';
// import { store } from '../store';

export default function BlogList({store}) {
  function parseDate(string) {
    const [day, month, year] = string.split('/').map((part) => parseInt(part, 10));
    return new Date(year, month - 1, day); // months are zero-based in JS
  }

  console.log(store[0].date)
  const sortedStore = [...store].sort((a, b) => parseDate(b.date) - parseDate(a.date));
  console.log(sortedStore)
  sortedStore.map((item, index) => {
    console.log(item.date)
    console.log(parseDate(item.date).getUTCFullYear())
  })
  //   setSortedStore(sortedData);

  console.log(parseDate(store[0].date))
  // console.log(sortedStore)

  return (
    <ul className="text-center">
      {sortedStore.map((item, index) => (
        <>
        <BlogYear item={item} index={index} store={sortedStore}/>

        <BlogEntry
          key={index}
          href={item.href}
          title={item.title}
          excerpt={item.excerpt}
          date={item.date}
          tags={item.tags}
        />
        </>
      ))} 
    </ul>
  );
}
