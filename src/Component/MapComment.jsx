import React, { useEffect, useState } from "react";
import CreateComment from "./CreateComment";
import { collection, deleteDoc, doc, onSnapshot, orderBy, query } from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import { useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { Ellipsis, Trash, X } from "lucide-react";

const MapComment = () => {
  const { postId } = useParams();
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const commentRef = collection(db, "posts", postId, "comments");
    const q = query(commentRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newComment = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments(newComment);
    });
    return () => unsubscribe();
  }, [postId]);

  return (
    <div>
      <CreateComment />
      <div className="mb-25 md:mb-auto text-sm">
        <p className="my-3">All comment</p>
        <div className="w-full bg-gray-100 rounded-2xl p-4">
          {comments.map((comment) => (
            <div key={comment.id} className="border-b mb-5 border-gray-300 pb-3">
              <div className="flex justify-between">
                <div>
                    <h1 className="text-sm ">{comment.createdBy}</h1>

                    <p className="font-extralight text-xs">
                    {formatDistanceToNow(
                        comment.createdAt?.toDate
                        ? comment.createdAt.toDate()
                        : new Date()
                    )}
                    </p>
                </div>
              </div>
              <p className="font-semibold mt-2">{comment.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MapComment;
