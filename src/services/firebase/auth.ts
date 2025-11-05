import { auth } from "../../../config/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { User } from "../../types/user";

export const loginUser = async (email: string, password: string) => {
  await signInWithEmailAndPassword(auth, email, password);
};

export const SignupUser = async(email:string, password:string, displayName:string)=>{
    const result = await createUserWithEmailAndPassword(auth, email, password);
    if(auth.currentUser){
        await updateProfile(auth.currentUser,{
            displayName
        })
    }
    return result;
}