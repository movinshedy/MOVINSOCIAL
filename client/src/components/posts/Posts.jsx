import { makeRequest } from "../../axios";
import Post from "../post/Post";
import "./posts.scss";
import { useQuery } from "@tanstack/react-query";

const Posts = ({userId}) => {
  const { isLoading, error, data } = useQuery({
    queryKey: ["posts"],
    queryFn: () =>
      makeRequest.get("/posts?userId=")
        .then((res) => {
          console.log("Response data:", res.data);
          return res.data;
        })
        .catch((err) => {
          console.error("Error fetching posts:", err);
          throw err;
        }),
  });

  console.log({ isLoading, error, data });

  return (
    <div className="posts">
      {error ? (
        <p className="error">Something went wrong while loading posts!</p>
      ) : isLoading ? (
        <p className="loading">Loading...</p>
      ) : (
        data.map((post) => (
          <Post post={post} key={post.id} />
        ))
      )}
    </div>
  );
};

export default Posts;
