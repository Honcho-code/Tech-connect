import { X } from "lucide-react";
import React, { useState } from "react";
import { Image } from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../config/firebase.js";

const CreatePostModal = ({ postModal, setPostModal }) => {
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

      // const imageUrl = await handleImageUpload();
      const postRef = collection(db, "posts");
      const docRef = await addDoc(postRef, {
        createdAt: serverTimestamp(),
        postText: postMessage,
        createdBy: auth.currentUser.displayName,
        imageUrl: imageUrl,
        LikeCount: 0,
        commentCount: 0,
        viewsCount: 0,
      });
      console.log("Button clicked");
      console.log(docRef.id);
      setPostMessage("");
      setImageFile(null);
      setPostModal(false);
    } catch (error) {
      console.error("Error creating post", error);
    }
  };
  return (
    <div className="h-screen fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-xl p-6 relative mx-4">
        <div className="flex gap-5 items-center mb-8">
          <X
            onClick={() => setPostModal(false)}
            className="bg-gray-200 p-1 rounded cursor-pointer"
          />
          <p className="text-lg md:text-xl font-semibold">Create a post</p>
        </div>
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
              <p className="text-xs md:text-sm font-extralight w-40 md:w-full">
                Image uploaded is saved. Go ahead and share post.
              </p>
            </div>
            <button
              className={`bg-[#7E1CAE] text-sm text-white px-4 py-2 rounded-full cursor-pointer ${postMessage ? "bg-[#7E1CAE]" : "bg-gray-400"}`}
              onClick={handleCreatePost}
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;
