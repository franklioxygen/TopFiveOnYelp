import React from "react";
// asyncReactor is a package fetch data asynchronous in nextjs
import { asyncReactor } from "async-reactor";

const Loader = () => {
  return <a>Loading ...</a>;
};

const AsyncPosts = async ({ shopId }) => {
  const data = await fetch("http://localhost:8080/reviews/?id=" + shopId);
  const review = await data.json();

  return (
    <blockquote className="small">
      {review.user.name}: {review.text.slice(0, 80)}...{" "}
      <a href={review.url}>Read More</a>
    </blockquote>
  );
};

export default asyncReactor(AsyncPosts, Loader);
