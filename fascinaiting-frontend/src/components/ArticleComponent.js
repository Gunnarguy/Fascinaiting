import React from 'react';

const ArticleComponent = ({ title, content, readMoreLink }) => {
    return (
        <article className='article'>
            <h3>{title}</h3>
            <p>{content}</p>
            <a href={readMoreLink} className='read-more btn'>Read More</a>
        </article>
    );
}

export default ArticleComponent;
