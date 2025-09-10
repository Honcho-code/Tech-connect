import React, { useState } from 'react'
import { auth, db } from '../../config/firebase'
import { addDoc, collection, doc, increment, serverTimestamp, updateDoc } from 'firebase/firestore'
import { useParams } from 'react-router-dom'

const CreateComment = () => {
    const {postId} = useParams()
    const [comment, setComment] = useState("")

    const handleAddComment = async(postId, userId)=>{
        try {
            if (!comment.trim()) return;
            const commentRef = collection(db, "posts", postId, "comments")
            await addDoc(commentRef, {
                userId,
                comment,
                createdBy: auth.currentUser?.displayName,
                createdAt: serverTimestamp()
            });
            const postRef = doc(db, "posts", postId)
            await updateDoc(postRef, {
                commentCount: increment(1)
            });
            
            console.log("Comment created")
            setComment("")
        } catch (error) {
            console.error("error creating comments", error)
        }
    }
  return (
    <div>
        <div className="flex items-center gap-4 border rounded-full justify-center py-2 px-3">
          <input
          type='text'
            value={comment}
            placeholder="Post your reply"
            className="w-full outline-none"
            rows={2}
            onChange={(e) => setComment(e.target.value)}
          ></input>
          <button type='submit'
            className="bg-[#7E1CAE] text-sm text-white px-4 py-2 rounded-full cursor-pointer"
            onClick={()=>handleAddComment(postId,auth?.currentUser?.uid)}
          >
            Post
          </button>
        </div>
    </div>
  )
}

export default CreateComment