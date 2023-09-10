import { ManageAccountsOutlined } from "@mui/icons-material";
import { Box, Typography, Divider, useTheme } from "@mui/material";
import UserImage from "../../components/UserImage.jsx";
import FlexBetween from "../../components/FlexBetween.jsx";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetUserQuery } from "../../state/slices/usersApiSlice.js";
import { CircularProgress } from "@mui/material";

const UserWidget = ({ userId, picturePath }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const { palette } = useTheme();
  const navigate = useNavigate();
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;

  const { data } = useGetUserQuery({ userId });

  useEffect(() => {
    setUser(data);
    setIsLoading(false);
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading) {
    return <CircularProgress />;
  }

  if (!user) {
    return null;
  }

  const { fullName, username, activeCardId } = user;

  return (
    <WidgetWrapper>
      {/* FIRST ROW */}
      <FlexBetween
        gap="0.5rem"
        pb="1.1rem"
        onClick={() => navigate(`/profile/${userId}`)}
      >
        <FlexBetween gap="1rem">
          <UserImage image={picturePath} />
          <Box>
            <Typography
              variant="h4"
              color={dark}
              fontWeight="500"
              sx={{
                "&:hover": {
                  color: palette.primary.light,
                  cursor: "pointer",
                },
              }}
            >
              {fullName}
            </Typography>
            <Typography color={medium}>@{username}</Typography>
          </Box>
        </FlexBetween>
        <ManageAccountsOutlined />
      </FlexBetween>

      <Divider />
      {/* SECOND ROW */}
      {/* <Box p="1rem 0"> */}
      <Box p="1rem 0" display="flex" alignItems="center" gap="1rem" mb="0.5rem">
        {String(activeCardId).length > 0 ? (
          <Typography color={medium}>
            {" "}
            Active card with id {activeCardId}
          </Typography>
        ) : (
          <Typography color={medium}>No active card</Typography>
        )}
      </Box>
      {/* </Box> */}
    </WidgetWrapper>
  );
};

export default UserWidget;
