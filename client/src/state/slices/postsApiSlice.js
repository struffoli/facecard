import { apiSlice } from "./apiSlice";
import { POSTS_URL } from "./constants";

export const postsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFeedPosts: builder.query({
      query: (data) => ({
        url: `${POSTS_URL}/${data.userId}/feed`,
        method: "GET",
      }),
    }),
    getUserPosts: builder.query({
      query: (data) => ({
        url: `${POSTS_URL}/${data.userId}`,
        method: "GET",
      }),
    }),
    patchLike: builder.mutation({
      query: (data) => ({
        url: `${POSTS_URL}/${data.postId}/like`,
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: data,
      }),
    }),
  }),
});

export const {
  useGetFeedPostsQuery,
  useGetUserPostsQuery,
  usePatchLikeMutation,
} = postsApiSlice;
