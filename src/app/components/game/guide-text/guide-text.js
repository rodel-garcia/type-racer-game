import React from 'react';
import style from './guide-text.module.scss';

const GuideText = ({ data, highlightedText }) => {
  return (
    <section className={style['guide-text']}>
      {highlightedText.length ? (
        <p>
          <mark>{highlightedText}</mark>
          {data.replace(highlightedText, '')}
        </p>
      ) : (
        <p>{data}</p>
      )}
    </section>
  );
};

export default GuideText;
