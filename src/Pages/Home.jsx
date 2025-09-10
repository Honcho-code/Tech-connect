import BottomBar from "../Component/BottomBar"
import Center from "../Component/Center"
import CreatePostModal from "../Component/CreatePostModal";
import LeftSidebar from "../Component/LeftSidebar"
import RightSidebar from "../Component/RightSidebar"
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

const Home = ({ postModal, setPostModal }) => {
  
  return (
    <div className="relative">
      {postModal ? <div className="absolute h-screen z-10 top-0 bottom-0 left-0 right-0"><CreatePostModal postModal={postModal} setPostModal={setPostModal}/>
</div> : ""}
    <div className="block md:grid md:grid-cols-8 lg:grid-cols-14 gap-5">
      <LeftSidebar postModal={postModal} setPostModal={setPostModal}/>
      <Center/>
      <RightSidebar/>
      <BottomBar postModal={postModal} setPostModal={setPostModal}/>
    </div>
    </div>
  )
}

export default Home