import { useState } from "react";
import Signupform from "./Pages/Signup";
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute, PublicRoute } from "./Component/RouteRule";
import Notification from "./Pages/Notification";
import Bookmarks from "./Pages/Bookmarks";
import Profile from "./Pages/Profile";
import Dash from "./Pages/Dash";
import PostDetail from "./Pages/PostDetail";

function App() {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [postModal, setPostModal] = useState(false)

  // const navigate = useNavigate();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home postModal={postModal} setPostModal={setPostModal}/>
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Dash />}/>
          <Route path="notification" element={<Notification/>}/>
          <Route path="bookmarks" element={<Bookmarks/>}/>
          <Route path="profile" element={<Profile/>}/>
          <Route path="/post/:postId" element={<PostDetail/>}/>
        </Route>
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signupform
                userName={userName}
                setUserName={setUserName}
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                error={error}
                setError={setError}
              />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login
                userName={userName}
                setUserName={setUserName}
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                error={error}
                setError={setError}
              />
            </PublicRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
