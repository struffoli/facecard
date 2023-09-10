import { Box, Typography, useTheme, CircularProgress } from "@mui/material";
import Friend from "../../components/Friend.jsx";
import WidgetWrapper from "../../components/WidgetWrapper.jsx";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFriends } from "../../state/slices/authSlice.js";
import { useGetFriendsQuery } from "../../state/slices/usersApiSlice.js";

const FriendListWidget = ({ userId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const friends = useSelector((state) => state.auth.user.friends);

  const { data } = useGetFriendsQuery({ userId });

  useEffect(() => {
    setFriends(data);
    setIsLoading(false);
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <WidgetWrapper>
      <Typography
        color={palette.neutral.dark}
        variant="h5"
        fontWeight="500"
        sx={{ mb: "1.5rem" }}
      >
        Friend List
      </Typography>
      <Box display="flex" flexDirection="column" gap="1.5rem">
        {isLoading ? (
          <CircularProgress />
        ) : friends.length > 0 ? (
          friends?.map(({ _id }) => (
            <Friend key={friend._id} friendId={friend._id} />
          ))
        ) : (
          <Typography color={palette.neutral.medium} sx={{ mb: "0.5rem" }}>
            No friends found
          </Typography>
        )}
      </Box>
    </WidgetWrapper>
  );
};
export default FriendListWidget;
