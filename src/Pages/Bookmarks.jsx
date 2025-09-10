import React, { useEffect, useState } from 'react'
import { auth, db } from '../../config/firebase'
import { collection, deleteDoc, doc, getDoc, onSnapshot } from 'firebase/firestore'
import { formatDistanceToNow } from 'date-fns'
import { Bookmark, ChevronLeft, Heart, MessageCircle } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

const Bookmarks = () => {
  const navigate = useNavigate()
  const [bookMarks, setBookMarks] = useState([])

  const removeBookMark = async(bookmarkId)=>{
    const user = auth.currentUser
    try {
      const bookmarkRef = doc(db, "users", user.uid, "bookmarks", bookmarkId, )
    await deleteDoc(bookmarkRef)
    console.log("Bookmark removed")
    } catch (error) {
      console.log("Error removeing bookmark", error)
    }
  }


  useEffect(()=>{
    const user = auth.currentUser;
    if(!user) return;

    const bookmarksRef = collection(db, "users", user.uid, "bookmarks");
    const unsubscribe = onSnapshot(bookmarksRef, async(snapshot)=>{
      const bookmarkData = snapshot.docs.map((doc)=>doc.data().postId);

      const postPromises = bookmarkData.map(async(postId)=>{
        const postRef = doc(db, "posts", postId);
        const postSnap = await getDoc(postRef);

        if(postSnap.exists()){
          return{id: postSnap.id, ...postSnap.data()}
        }
        return null
      });
      const posts = (await Promise.all(postPromises)).filter((p)=> p !== null)
      setBookMarks(posts)
    })
    return ()=>unsubscribe()
  },[])
  return (
    <div className="p-4 md:py-2 lg:mx-10">
      <div className='bg-white sticky top-0 py-2 mb-5'>
            <div className='grid grid-cols-3 items-center cursor-pointer' onClick={()=>navigate(-1)}>
                <ChevronLeft className="p-1 size-8 bg-gray-200 rounded"/>
                <img src="/Logo-purple.png" alt="" className='w-52 md:hidden'/>
            </div>
    </div>
      {bookMarks.length === 0 ? (
        <p className='flex justify-center mx-auto'>No bookmarks yet.</p>
      ):(
        <div>
        {bookMarks.map((post) => {
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
                    <p>{post.createdBy}</p>
                    <p className="font-extralight text-xs">{timeAgo}</p>
                  </div>
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
                      onClick={null}
                    >
                      <Heart className="size-5" />
                      <p className="text-sm font-light">{post.LikeCount}</p>
                    </div>
                    <Link to={`/post/${post.id}`} className="flex items-center gap-2 cursor-pointer">
                      <MessageCircle className="size-5" />
                      <p className="text-sm font-light">{post.commentCount}</p>
                    </Link>
                    <div className="flex items-center gap-2 cursor-pointer" onClick={()=>removeBookMark(post.id)}>
                      <Bookmark className="size-5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      )}
    </div>
  )
}

export default Bookmarks