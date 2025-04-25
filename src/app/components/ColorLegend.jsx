import React, { useEffect, useState } from 'react';

export default function ColorLegend({ highlightedCategory }) {
  const [colorMap, setColorMap] = useState({});

  useEffect(() => {
    fetch('/word_class_colors.json')
      .then(res => res.json())
      .then(data => setColorMap(data));
  }, []);

  return (
    <div className="mt-6">
      <h4 className="font-semibold mb-2">📘 Farblegende</h4>
      <div className="flex flex-wrap gap-3">
        {Object.entries(colorMap).map(([category, classes], idx) => {
          const highlight = highlightedCategory === category ? ' ring-2 ring-black' : ' ring-transparent';
          return (
            <div
              key={idx}
              className={classes + ' px-2 py-1 rounded text-sm transition' + highlight}
            >
              {category}
            </div>
          );
        })}
      </div>
    </div>
  );
}