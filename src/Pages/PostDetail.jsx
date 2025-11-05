import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { auth, db } from "../../config/firebase";
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
} from "firebase/firestore";
import {
  Badge,
  Bookmark,
  ChevronLeft,
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
import { formatDistanceToNow } from "date-fns";
import MapComment from "../Component/MapComment";

const PostDetail = () => {
    const navigate = useNavigate()
  const { postId } = useParams();
  const [post, setPosts] = useState(null);
  const [isLiked, setIsLiked] = useState();
  const [miniMenu, setMiniMenu] = useState(null);

  const handleOption = (id) => {
    setMiniMenu(miniMenu === id ? null : id);
  };

  const handleDeletePost = async (postId) => {
    try {
      const docRef = doc(db, "posts", postId);
      await deleteDoc(docRef);
      setMiniMenu(false);
      navigate(-1)
      console.log("Sucessfully deleted", docRef);
    } catch (error) {
      console.error("Error deleting post", error);
    }
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        if (!postId) return;
        const docRef = doc(db, "posts", postId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setPosts({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.log("no such post");
        }
      } catch (error) {
        console.error("Error fetching post", error);
      }
    };
    fetchPost();
  }, [postId]);

  if (!post) return <p>Loading...</p>;
  return (
    <div className=" p-4 md:py-2 lg:mx-10">
        <div className='bg-white sticky top-0 py-2 mb-5'>
            <div className='grid grid-cols-3 items-center cursor-pointer' onClick={()=>navigate(-1)}>
                <ChevronLeft className="p-1 size-8 bg-gray-200 rounded"/>
                <img src="/Logo-purple.png" alt="" className='w-52 md:hidden'/>
            </div>
    </div>
      <div>
        <div key={post.id} className="mb-10">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <img src="/Ellipse.png" alt="" />
              <div className="">
                {post.createdBy === "Clinton Rapheal" ? <div className="flex items-center gap-2"><p>{post.createdBy}</p> <Badge className="size-3 text-black"/> </div> : <p>{post.createdBy}</p>}
                
                <p className="font-extralight text-xs">{
                    formatDistanceToNow(post.createdAt?.toDate ? post.createdAt.toDate() : new Date())
                    }</p>
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
                      <div
                        className="flex justify-center items-center gap-2 cursor-pointer"
                        onClick={() => handleDeletePost(post.id)}
                      >
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
            <p>{post.postText}</p>
            <img
              src={post.imageUrl}
              alt=""
              className="mt-1 rounded-xl w-full"
            />
            <div className="mt-3 flex items-center justify-between">
              <div className="flex gap-5">
                <div className="flex items-center gap-2 cursor-pointer">
                  <MessageCircle className="size-5" />
                  <p className="text-sm font-light">{post.commentCount}</p>
                </div>
                <div className="flex items-center gap-2 cursor-pointer">
                  <Bookmark className="size-5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <MapComment/>
    </div>
  );
};

export default PostDetail;
