import React, { useState } from "react";
import { Image } from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../config/firebase.js";

const PostContainer = () => {
  const [postMessage, setPostMessage] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const handleImageUpload = async () => {
    if (!imageFile) return;

    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", "Tconnect"); // from Cloudinary

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/di1pomeyp/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      console.log("Uploaded image URL:", data.secure_url);

      return data.secure_url; // 👈 this is what you save in Firestore
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  const handleCreatePost = async (e) => {
    console.log("Button active");
    e.preventDefault();
    if (!postMessage) return;

    try {
      let imageUrl = null;
      if (imageFile) {
        imageUrl = await handleImageUpload();
      }
      const postRef = collection(db, "posts");
      const docRef = await addDoc(postRef, {
        createdAt: serverTimestamp(),
        postText: postMessage,
        createdBy: auth.currentUser.displayName,
        imageUrl: imageUrl,
        LikeCount: 0,
        commentCount: 0,
        userId: auth.currentUser.uid,
      });
      console.log("Button clicked");
      console.log(docRef.id);
      setPostMessage("");
      setImageFile(null);
    } catch (error) {
      console.error("Error creating post", error);
    }
  };

  return (
    <div className="hidden md:block my-5 border-2 border-gray-300 rounded-xl p-4">
      <div>
        <div className="flex items-start gap-5">
          <img src="/Ellipse.png" alt="" />
          <textarea
            name=""
            id=""
            value={postMessage}
            placeholder="What's happening"
            className="w-full border-b-1 border-gray-300 resize-none outline-none"
            rows={3}
            onChange={(e) => setPostMessage(e.target.value)}
          ></textarea>
        </div>
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center gap-3">
            <label htmlFor="image-upload">
              <Image className="size-5 text-[#7E1CAE] cursor-pointer" />
            </label>
            <input
              type="file"
              accept="image/*"
              name=""
              id="image-upload"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setImageFile(e.target.files[0]); // ✅ safely set file
                  console.log("Selected file:", e.target.files[0]);
                }
              }}
            />
            <p className="text-xs md:text-sm font-extralight w-40 md:w-60 lg:w-full">
              Image uploaded is saved. Go ahead and share post.
            </p>
          </div>
          <button
            className={`bg-[#7E1CAE] text-sm text-white px-4 py-2 rounded-full  ${postMessage ? "bg-[#7E1CAE] cursor-pointer" : "bg-gray-400 cursor-wait"}`}
            onClick={handleCreatePost}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostContainer;
