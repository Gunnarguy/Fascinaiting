import React from 'react';
import ArticleComponent from './ArticleComponent';
import TwitterFeedComponent from './TwitterFeedComponent';

const MainContent = () => {
  return (
    <main>
      <ArticleComponent title='Revolutionary AI advancements in healthcare' content='Discover how AI is transforming medical diagnosis, treatment, and healthcare efficiency.' readMoreLink='#' />
      <ArticleComponent title='The Rise of AI in Medical Devices' content='In 2023 alone, 91 innovative devices were cleared. A Growing Field: The number of AI-enabled medical devices has surged in the past five years, with a staggering 33% increase in 2023.' readMoreLink='#' />
      <TwitterFeedComponent tweetId='1759799411075657890' />
      <TwitterFeedComponent tweetId='1759801570185855263' />
    </main>
  );
}

export default MainContent;
