import "./profile.scss";
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import TwitterIcon from "@mui/icons-material/Twitter";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Posts from "../../components/posts/Posts";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useContext, useState } from "react";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import Update from "../../components/update/Update"; // Ensure the correct casing and path for Update component

const Profile = () => {
  const [openUpdate, setOpenUpdate] = useState(false);
  const { currentUser } = useContext(AuthContext);

  const userId = parseInt(useLocation().pathname.split("/")[2]); // Get userId from URL

  // Fetch user data
  const { isLoading, error, data } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => makeRequest.get(`/users/find/${userId}`).then((res) => res.data),
  });

  // Fetch relationships
  const { isLoading: rIsLoading, data: relationshipData = [] } = useQuery({
    queryKey: ["relationship", userId],
    queryFn: () => makeRequest.get(`/relationships?followedUserId=${userId}`).then((res) => res.data),
  });

  const queryClient = useQueryClient();

  // Mutation to handle follow/unfollow
  const mutation = useMutation({
    mutationFn: async (following) => {
      if (following) {
        return await makeRequest.delete(`/relationships?userId=${userId}`);
      }
      return await makeRequest.post("/relationships", { userId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["relationship"] });
    },
  });

  const handleFollow = () => {
    mutation.mutate(relationshipData.includes(currentUser.id));
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading profile.</div>;

  return (
    <div className="profile">
      <div className="images">
        <img src={data.coverPic ? `/upload/${data.coverPic}` : "/default-cover.jpg"} alt="Cover" className="cover" />
        <img src={data.profilePic ? `/upload/${data.profilePic}` : "/default-profile.jpg"} alt="Profile" className="profilePic" />
      </div>
      <div className="profileContainer">
        <div className="uInfo">
          <div className="left">
            <a href="http://facebook.com">
              <FacebookTwoToneIcon fontSize="large" />
            </a>
            <a href="http://instagram.com">
              <InstagramIcon fontSize="large" />
            </a>
            <a href="http://twitter.com">
              <TwitterIcon fontSize="large" />
            </a>
            <a href="http://linkedin.com">
              <LinkedInIcon fontSize="large" />
            </a>
            <a href="http://pinterest.com">
              <PinterestIcon fontSize="large" />
            </a>
          </div>
          <div className="center">
            <span>{data.name || "Unknown User"}</span>
            <div className="info">
              <div className="item">
                <PlaceIcon />
                <span>{data.city || "N/A"}</span>
              </div>
              <div className="item">
                <LanguageIcon />
                <span>{data.website || "N/A"}</span>
              </div>
            </div>
            {rIsLoading ? (
              "Loading..."
            ) : userId === currentUser.id ? (
              <button onClick={() => setOpenUpdate(true)}>Update</button>
            ) : (
              <button onClick={handleFollow}>
                {relationshipData.includes(currentUser.id) ? "Following" : "Follow"}
              </button>
            )}
          </div>
          <div className="right">
            <EmailOutlinedIcon />
            <MoreVertIcon />
          </div>
        </div>
        <Posts userId={userId} />
      </div>
      {openUpdate && <Update setOpenUpdate={setOpenUpdate} user={data} />}
    </div>
  );
};

export default Profile;
