import { create } from "zustand";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  User as FirebaseUser,
} from "firebase/auth";
import { auth } from "../../config/firebase";
import { User } from "../types/user";

type AuthState = {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string)=>Promise<void>
  signup:(email:string, password:string,displayName:string)=>Promise<void>
  logout:()=>Promise<void>
};
export const useAuthStore = create<AuthState>((set, get)=>({
  user: null,
  loading: false,
  error: null,

  login: async(email, password)=>{
    set({loading: true, error: null})
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password)
      const fbUser: FirebaseUser = credential.user;

      const appUser: User={
        id:fbUser.uid,
        email: fbUser.email??"",
        displayName:fbUser.displayName??"",
        profileImage:fbUser.photoURL??undefined
      }
      set({user:appUser, loading:false})
    } catch (error:any) {
      set({error:error.message || "Login failde", loading:false})
    }finally{
      set({loading:false})
    }
  },
  signup: async (email, password, displayName)=>{
    set({loading:true, error: null});
    try {
      const credential = await createUserWithEmailAndPassword(auth,email,password)
      const fbUser = credential.user

      await updateProfile(fbUser, {displayName})

      const appUser: User = {
        id:fbUser.uid,
        email:fbUser.email ?? "",
        displayName:fbUser.displayName??"",
        profileImage:fbUser.photoURL ?? undefined
      }
      set({user:appUser, loading:false})
    } catch (error:any) {
      set({error:error.message || "Signup failed", loading: false})
    }finally{
      set({loading: false})
    }
  },
  logout: async()=>{
    try {
      await signOut(auth)
      set({user: null})
    } catch (error:any) {
      set({error:error.message || "Logout failed", })
    }finally{
      set({loading: false})
    }
  }
  
}))