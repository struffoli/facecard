import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../../state/slices/authSlice.js";
import PostWidget from "./PostWidget.jsx";
import {
  useGetFeedPostsQuery,
  useGetUserPostsQuery,
} from "../../state/slices/postsApiSlice.js";
import { CircularProgress, Typography } from "@mui/material";

const PostsWidget = ({ userId, isProfile = false }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.auth.posts);
  const [isLoading, setIsLoading] = useState(true);

  const { data } = isProfile
    ? useGetUserPostsQuery({ userId })
    : useGetFeedPostsQuery({ userId });

  useEffect(() => {
    dispatch(setPosts({ posts: data }));
    setIsLoading(false);
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Typography variant="h4" fontWeight="500">
        Feed
      </Typography>

      {isLoading ? (
        <CircularProgress />
      ) : (
        posts?.map(
          ({
            _id,
            userId,
            linkedObjectId,
            linksToCard,
            description,
            likes,
          }) => (
            <PostWidget
              key={_id}
              postId={_id}
              postUserId={userId}
              linkedObjectId={linkedObjectId}
              linksToCard={linksToCard}
              description={description}
              likes={likes}
            />
          )
        )
      )}
    </>
  );
};

export default PostsWidget;
