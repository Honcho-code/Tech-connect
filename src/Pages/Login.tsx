import React, { useState } from "react";
import { Eye, EyeOff, LockKeyhole, Mail, UserRound } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../config/firebase";

interface LoginProps{
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
}

const Login:React.FC<LoginProps> = ({
  email,
  setEmail,
  password,
  setPassword,
}) => {
  const [error, setError] = useState<string>("")
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
  try {
    await signInWithEmailAndPassword(auth, email, password);
    setError("");
    navigate("/");  
  } catch (err) {
    console.log("Login error:", err.code, err.message);

    if (err.code === "auth/invalid-credentials" || err.code === "auth/user-not-found") {
      setError("No account found with this email.");
    } else if (err.code === "auth/wrong-password") {
      setError("Incorrect password. Please try again.");
    } else if (err.code === "auth/invalid-email") {
      setError("Invalid email format.");
    } else if (err.code === "auth/network-request-failed") {
      setError("Network error. Please check your connection.");
    } else {
      setError("Login failed. Please try again later.");
    }
  }
};
    const [showPassword, setShowPassword] = useState(false);
  return <div className='h-screen bg-[url("/bg.jpg")] bg-cover bg-center m-auto flex flex-col justify-center items-center'>
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
              Login to your Account
            </h1>
            <p className="text-xs md:text-sm text-white font-light md:font-light">
              Continue from where you stopped techie.
            </p>
          </div>
          <form action="" autoComplete="off" className="flex flex-col gap-4">
            
            <div className="flex items-center gap-2 backdrop-blur-md bg-white/30 p-3 rounded-md">
              <Mail className="size-5 text-black" />
              <input
                type="email"
                placeholder="Email Address"
                autoComplete="new-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-black w-full outline-none"
              />
            </div>
            <div className="flex items-center gap-2 backdrop-blur-md bg-white/30 p-3 rounded-md">
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
            <p className="text-red-700 text-sm md:text-[16px]">{error}</p>
            <button type="submit" onClick={handleLogin} className="w-full py-3 bg-purple-800 text-white rounded cursor-pointer">
              Login
            </button>
          </form>
          <p className="text-white text-sm text-center">
            New to tech-connect?{" "}
            <Link to={"/signup"} className="underline cursor-pointer ">Create Account</Link>
          </p>
        </div>
        </div>;
};

export default Login;
