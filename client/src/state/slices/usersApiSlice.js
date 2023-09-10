import { apiSlice } from "./apiSlice";
import { AUTH_URL, USERS_URL } from "./constants";

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${AUTH_URL}/login`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: data,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${AUTH_URL}/register`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${AUTH_URL}/logout`,
        method: "POST",
      }),
    }),
    getUser: builder.query({
      query: (data) => ({
        url: `${USERS_URL}/${data.userId}/profile`,
        method: "GET",
      }),
    }),
    getFriends: builder.query({
      query: (data) => ({
        url: `${USERS_URL}/${data.userId}/friends`,
        method: "GET",
      }),
    }),
    patchFriend: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/${data.userId}/${data.friendId}`,
        method: "PATCH",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetUserQuery,
  useGetFriendsQuery,
  usePatchFriendMutation,
} = usersApiSlice;
