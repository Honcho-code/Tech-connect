import {
  collection,
  doc,
  getDocs,
  increment,
  serverTimestamp,
  setDoc,
  updateDoc,
  getDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  addDoc,
} from "firebase/firestore";
import {
  Badge,
  Bookmark,
  Delete,
  Edit,
  Ellipsis,
  Eye,
  Heart,
  MessageCircle,
  Pen,
  Trash,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { auth, db } from "../../config/firebase";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";

const DisplayPost = () => {
  const [posts, setPosts] = useState([]);
  const [now, setNow] = useState(new Date());
  const [isLiked, setIsLiked] = useState();
  const [miniMenu, setMiniMenu] = useState(null);

  const handleAddBookmark = async(postId)=>{
    try {

      const userId = auth.currentUser.uid;

      const bookmarkRef = doc(db, "users", userId, "bookmarks", postId);
       await setDoc(bookmarkRef,{
        postId,
        savedAt: serverTimestamp()
       })
       console.log("added to bookmark")
    } catch (error) {
      console.error("Error adding post to bookmark", error)
    }
  }

  const handleOption = (id) => {
    setMiniMenu(miniMenu === id ? null : id);
  };

  const handleDeletePost = async(postId)=>{
    try {
      const docRef = doc(db, "posts", postId)
      await deleteDoc(docRef)
      setMiniMenu(false)
      console.log("Sucessfully deleted", docRef)
    } catch (error) {
      console.error("Error deleting post", error)
    }
  }

  const handleLikePost = async (postId, userId, setPosts) => {
    try {
      const likeRef = doc(db, "posts", postId, "likes", userId);
      const postRef = doc(db, "posts", postId);

      const likeSnap = await getDoc(likeRef);

      if (likeSnap.exists()) {
        await deleteDoc(likeRef);
        await updateDoc(postRef, { LikeCount: increment(-1) });
        setIsLiked(false);
      } else {
        await setDoc(likeRef, { likedAt: serverTimestamp() });
        await updateDoc(postRef, { LikeCount: increment(1) });
        setIsLiked(true);
      }

      console.log("button clicked");
    } catch (error) {
      console.log("error liking this post", error);
    }
  };

  useEffect(() => {
  const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const postsData = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setPosts(postsData);
  });
    const interval = setInterval(() => {
      setNow(new Date()); // just update state → re-render
    }, 60000);

    return () => clearInterval(interval),() => unsubscribe(); // cleanup
}, []);

  return (
    <div className="mt-7 my-30 md:my-auto">
      <div>
        {posts.map((post) => {
          const createdAt = post.createdAt?.toDate
            ? post.createdAt.toDate()
            : new Date();

          const timeAgo = formatDistanceToNow(createdAt, { addSuffix: true });
          return (
            <div key={post.id} className="mb-10">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <img src="/Ellipse.png" alt="" />
                  <div className="">
                {post.createdBy === "Clinton Rapheal" ? <div className="flex items-center gap-2"><p>{post.createdBy}</p> <Badge className="size-3 text-black"/> </div> : <p>{post.createdBy}</p>}
                    <p className="font-extralight text-xs">{timeAgo}</p>
                  </div>
                </div>
                <div className="relative">
                  {post.createdBy === auth.currentUser?.displayName && (
                    <>
                      {miniMenu === post.id ? (
                        <X
                          className="size-4 cursor-pointer"
                          onClick={() => handleOption(post.id)}
                        />
                      ) : (
                        <Ellipsis
                          className="size-4 cursor-pointer"
                          onClick={() => handleOption(post.id)}
                        />
                      )}

                      {miniMenu === post.id && (
                        <div className="absolute md:top-7 top-6 rounded-xl right-0 w-34 p-3 md:w-40 bg-black/50 text-white backdrop:blur-sm">
                          <div className="flex justify-center items-center gap-2 cursor-pointer" onClick={()=>handleDeletePost(post.id)}>
                            <Trash className="size-6" />
                            <p className="text-sm w-full">Delete post</p>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
              
              <div className="ml-12 mt-3">
                <Link to={`/post/${post.id}`}>
                  <p>{post.postText}</p>
                  <img
                    src={post.imageUrl}
                    alt=""
                    className="mt-1 rounded-xl w-full"
                  />
                </Link>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex gap-5">
                    <div
                      className={`flex items-center gap-2 cursor-pointer`}
                      onClick={() =>
                        handleLikePost(post.id, auth.currentUser.uid, setPosts)
                      }
                    >
                      <Heart className="size-5" />
                      <p className="text-sm font-light">{post.LikeCount}</p>
                    </div>
                    <Link to={`/post/${post.id}`} className="flex items-center gap-2 cursor-pointer">
                      <MessageCircle className="size-5" />
                      <p className="text-sm font-light">{post.commentCount}</p>
                    </Link>
                    <div className="flex items-center gap-2 cursor-pointer" onClick={()=>handleAddBookmark(post.id,)}>
                      <Bookmark className="size-5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DisplayPost;
