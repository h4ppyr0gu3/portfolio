import React, { useState } from 'react';
import List from './list';
import json from '../../../blogs.json';
import Fuse from 'fuse.js';

export default function Search() {
  const [searchText, setSearchText] = useState('');
  const [til, setTil] = useState(() => json.til.sort((a, b) => a.topics.localeCompare(b.topics)));

  const handleSearch = (event) => {
    event.preventDefault();

    if (searchText === '') {
      setTil(json.til);
      return;
    }

    const options = {
      keys: ['title', 'excerpt', 'topics'],
    };
    const fuse = new Fuse(json.til, options);
    const res = fuse.search(searchText).map((obj) => obj.item);
    setTil(res);
  };

  return (
    <div>
      <form onSubmit={handleSearch} className="mx-4 flex justify-center items-center mb-2">
        <label htmlFor="blogSearch" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
          Search
        </label>
        <div className="relative w-96 justify-center">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              aria-hidden="true"
              className="w-5 h-5 text-gray-500 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
          <input
            type="search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            name="search"
            id="blogSearch"
            className="block p-4 pl-10 text-sm text-gray-900 border-b border-gray-300 bg-transparent dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:outline-none dark:focus:border-sky-400 focus:border-sky-500 w-full"
            placeholder="Search for a Lesson..."
          />
          <button
            type="submit"
            className="text-white absolute right-2.5 bottom-2.5 bg-sky-400 hover:bg-sky-700 font-medium rounded-lg text-sm px-4 py-2 dark:bg-sky-500 dark:hover:bg-sky-700"
          >
            Search
          </button>
        </div>
      </form>
      <List til={til} />
    </div>
  );
}
