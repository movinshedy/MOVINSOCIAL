import "./post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import Comments from "../comments/Comments";
import { useContext, useState } from "react";
import moment from "moment";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { AuthContext } from "../../context/authContext";

const Post = ({ post }) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const [menuOpen, setMenutOpen] = useState(false);

  const { currentUser } = useContext(AuthContext);

  const { isLoading, error, data = [] } = useQuery({
    queryKey: ["likes", post.id],
    queryFn: () => makeRequest.get(`/likes?postId=${post.id}`).then((res) => res.data),
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (liked) => {
      if (liked) {
        return await makeRequest.delete(`/likes?postId=${post.id}`);
      }
      return await makeRequest.post("/likes", { postId: post.id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["likes"] });
    },
  });


  const deleteMutation = useMutation({
    mutationFn: async (postId) => {
      return await makeRequest.delete("/posts/"+ postId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const handleLike = () => {
    mutation.mutate(data.includes(currentUser.id));
  };

  const handleDelete= ()=> {
     deleteMutation.mutate(post.id)
  }

  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <img src={post.profilePic} alt="" />
            <div className="details">
              <Link to={`/profile/${post.userId}`} style={{ textDecoration: "none", color: "inherit" }}>
                <span className="name">{post.name}</span>
              </Link>
              <span className="date">{moment(post.createdAt).fromNow()}</span>
            </div>
          </div>
          <MoreHorizIcon onClick={()=>setMenutOpen(!menuOpen)} />
            {menuOpen &&  <button onClick={handleDelete}> delete</button>}
        </div>
        <div className="content">
          <p>{post.desc}</p>
          {post.img && <img src={`./upload/${post.img}`} alt="" />}
        </div>
        <div className="info">
          <div className="item">
            {isLoading ? (
              "Loading..."
            ) : error ? (
              "Error loading likes"
            ) : data.includes(currentUser.id) ? (
              <FavoriteOutlinedIcon style={{ color: "red" }} onClick={handleLike} />
            ) : (
              <FavoriteBorderOutlinedIcon onClick={handleLike} />
            )}
            {data ? data.length : 0} Likes
          </div>
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            {post.commentCount || 0} Comments
          </div>
          <div className="item">
            <ShareOutlinedIcon />
            Share
          </div>
        </div>
        {commentOpen && <Comments postId={post.id} />}
      </div>
    </div>
  );
};

export default Post;
