import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import {
  Box,
  CircularProgress,
  Divider,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "../../state/slices/authSlice.js";
import { usePatchLikeMutation } from "../../state/slices/postsApiSlice.js";
import WidgetWrapper from "../../components/WidgetWrapper.jsx";
import Friend from "../../components/Friend.jsx";
import FlexBetween from "../../components/FlexBetween.jsx";

const PostWidget = ({
  postId,
  postUserId,
  linkedObjectId,
  linksToCard,
  description,
  likes,
}) => {
  const dispatch = useDispatch();
  const loggedInUserId = useSelector((state) => state.auth.user._id);
  const isLiked =
    likes && loggedInUserId ? Boolean(likes[loggedInUserId]) : false;
  const likeCount = likes ? Object.keys(likes).length : 0;

  const [patchLike] = usePatchLikeMutation();

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.heart.main;

  const patchLikeHandler = async () => {
    try {
      const res = await patchLike({ userId: loggedInUserId, postId }).unwrap();
      dispatch(setPost({ post: res }));
    } catch (err) {
      console.log("An error occurred in patchLikeHandler: " + err?.message);
    }
  };

  return (
    <WidgetWrapper m="1rem 0">
      <Friend friendId={postUserId} />
      <Typography color={main} sx={{ mt: "1rem" }}>
        {description}
      </Typography>
      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLikeHandler}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>
        </FlexBetween>
      </FlexBetween>
    </WidgetWrapper>
  );
};

export default PostWidget;
