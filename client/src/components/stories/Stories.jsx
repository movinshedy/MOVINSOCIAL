import { useContext } from "react";
import "./stories.scss"
import { AuthContext } from "../../context/authContext"

const Stories = () => {

  const {currentUser} = useContext(AuthContext)

  //TEMPORARY
  const stories = [
    {
      id: 1,
      name: "Judith",
      img: "http://localhost:3000/upload/1733155686209Screenshot%202024-02-02%20220937.jpg",
    },
    {
      id: 2,
      name: "Barack",
      img: "http://localhost:3000/upload/1733157814241IMG_20201014_173418.jpg",
    },
    {
      id: 3,
      name: "Sheila",
      img: "http://localhost:3000/upload/1733158415496download%20(1).png",
    },
    {
      id: 4,
      name: "Mary",
      img: "http://localhost:3000/upload/1733104972311003.jpeg",
    },
  ];

  return (
    <div className="stories">
      <div className="story">
          <img src={currentUser.profilePic} alt="" />
          <span>{currentUser.name}</span>
          <button>+</button>
        </div>
      {stories.map(story=>(
        <div className="story" key={story.id}>
          <img src={story.img} alt="" />
          <span>{story.name}</span>
        </div>
      ))}
    </div>
  )
}

export default Stories