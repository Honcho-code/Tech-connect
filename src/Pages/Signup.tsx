import React, { useState } from "react";
import { Camera, Eye, EyeOff, LockKeyhole, Mail, UserRound } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../config/firebase";
import { SignupUser } from "../services/firebase/auth";

interface SognupProps{
  userName: string;
  setUserName: React.Dispatch<React.SetStateAction<string>>;
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
}

const Signupform = ({
  userName,
  setUserName,
  email,
  setEmail,
  password,
  setPassword,

}) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>("");


  const handleSignup = async (e)=>{
    e.preventDefault();
    try {
      await SignupUser(email, password, userName)

      setError("");
      navigate("/");  
    } catch (err) {
      console.log("Signup error:", err.code, err.message);

      if (err.code === "auth/email-already-in-use") {
        setError("An account with this email already exists.");
      } else if (err.code === "auth/password-does-not-meet-requirements") {
        setError("Password should be at least 6 characters.");
        setError("Password must contain an uppercase")
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email format.");
      } else if (err.code === "auth/network-request-failed") {
        setError("Network error. Please check your connection.");
      } else {
        setError("Signup failed. Please try again later.");
      }
    }
  }
  
  return (
      <div className='h-screen bg-[url("/bg.jpg")] bg-cover bg-center m-auto flex flex-col justify-center items-center'>
        <img
          src="/Logo-white.png"
          alt="/Logo-white.png"
          className=" w-32 md:w-48"
        />
        <p className="text-white text-sm md:text-lg font-light p-4 text-center">
          Create and interact with posts shared by techies on the tech space.
        </p>
        <div className="p-4 rounded-lg flex flex-col gap-4 w-11/12 md:w-1/2 lg:w-1/3 backdrop-blur-md bg-white/30">
        <div>
          <h1 className="text-lg md:text-2xl md:font-normal text-white mb-">
            Create an Account
          </h1>
          <p className="text-xs md:text-sm text-white font-light md:font-light">
            Welcome to tech-connect, Go connect with great minds like yourself.
          </p>
        </div>
        <form action="" autoComplete="off" className="flex flex-col gap-4">
          <div className="flex items-center gap-2 backdrop-blur-md bg-white/30 p-3 rounded-md">
            <UserRound className="size-5 text-black" />
            <input
              type="text"
              placeholder="Username"
              autoComplete="new-username"
              value={userName}
              required
              onChange={(e) => setUserName(e.target.value)}
              className="text-black w-full outline-none"
            />
          </div>
          <div className="flex items-center gap-2 backdrop-blur-md bg-white/30  p-3 rounded-md">
            <Mail className="size-5 text-black" />
            <input
              type="email"
              placeholder="Email Address"
              autoComplete="new-email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              className="text-black w-full outline-none"
            />
          </div>
          <div className="flex items-center gap-2 backdrop-blur-md bg-white/30  p-3 rounded-md">
            <LockKeyhole className="size-5 text-black" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-black w-full outline-none"
            />
            {showPassword ? (
              <Eye
                className="size-5 cursor-pointer"
                onClick={() => setShowPassword(false)}
              />
            ) : (
              <EyeOff
                className="size-5 cursor-pointer"
                onClick={() => setShowPassword(true)}
              />
            )}
          </div>
          
          {error && <p className="text-red-700 text-sm md:text-[16px]">{error}</p>}
          <button type="submit" onClick={handleSignup} className="w-full py-3 bg-purple-800 text-white rounded cursor-pointer">
            Sign up
          </button>
        </form>
        <p className="text-white text-sm text-center">
          Already have an account?{" "}
          <Link to={"/login"} className="underline cursor-pointer ">Log in</Link>
        </p>
      </div>
      </div>
  );
};

export default Signupform;
