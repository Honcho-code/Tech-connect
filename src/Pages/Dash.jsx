import React from "react";
import Navber from "../Component/Navber";
import PostContainer from "../Component/PostContainer";
import DisplayPost from "../Component/DisplayPost";

const Dash = () => {
  return (
    <div className="p-4 md:py-2 lg:mx-10">
      <Navber />
      <PostContainer />
      <DisplayPost />
    </div>
  );
};

export default Dash;
