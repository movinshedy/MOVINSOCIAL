import "./update.scss";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { makeRequest } from "../../axios";

const Update = ({ setOpenUpdate, user }) => {
  const [cover, setCover] = useState(null);
  const [profile, setProfile] = useState(null);
  const [texts, setTexts] = useState({
    name: user.name || "",
    city: user.city || "",
    website: user.website || "",
  });

  const upload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      return res.data;
    } catch (err) {
      console.error("File upload failed:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTexts((prev) => ({ ...prev, [name]: value }));
  };

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (updatedUser) => {
      return await makeRequest.put("/users", updatedUser);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] }); // Refresh user data
    },
  });

  const handleClick = async (e) => {
    e.preventDefault();
    let coverUrl = cover ? await upload(cover) : user.coverPic;
    let profileUrl = profile ? await upload(profile) : user.profilePic;

    mutation.mutate({ ...texts, coverPic: coverUrl, profilePic: profileUrl });
    setOpenUpdate(false);
  };

  return (
    <div className="update">
      <div className="updateContainer">
        <h2>Update Profile</h2>
        <form onSubmit={handleClick}>
          <label>
            Cover Picture:
            <input type="file" onChange={(e) => setCover(e.target.files[0])} />
          </label>
          <label>
            Profile Picture:
            <input type="file" onChange={(e) => setProfile(e.target.files[0])} />
          </label>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={texts.name}
              onChange={handleChange}
              placeholder="Enter your name"
            />
          </label>
          <label>
            City:
            <input
              type="text"
              name="city"
              value={texts.city}
              onChange={handleChange}
              placeholder="Enter your city"
            />
          </label>
          <label>
            Website:
            <input
              type="text"
              name="website"
              value={texts.website}
              onChange={handleChange}
              placeholder="Enter your website"
            />
          </label>
          <button type="submit">Update</button>
        </form>
        <button className="closeButton" onClick={() => setOpenUpdate(false)}>
          X
        </button>
      </div>
    </div>
  );
};

export default Update;
