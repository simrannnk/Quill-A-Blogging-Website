import Landing from "./pages/Landing";
import Home from "./pages/Home";
import {BrowserRouter as Router, Route, Routes, BrowserRouter} from 'react-router-dom';
import Editor from "./components/editor";
import Stories from "./pages/Stories";
import ProtectedRoute from "./service/protectedRoute";
import ViewStory from "./components/viewStory";
import Library from "./components/library";
import Profile from "./components/profile";
import HeroSection from "./pages/HeroSection";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HeroSection/>}></Route>
          <Route path="/quill" element={<HeroSection/>}></Route>
          <Route path="/join" element={<Home/>}></Route>
          <Route path="/" element={<ProtectedRoute/>}>
            <Route path="/home" element={<Landing/>}></Route>
          </Route>
          <Route path="/" element={<ProtectedRoute/>}>
            <Route path="/new-story" element={<Editor/>}></Route>
          </Route>
          <Route path="/" element={<ProtectedRoute/>}>
            <Route path="/stories" element={<Stories/>}></Route>
          </Route>
          <Route path="/" element={<ProtectedRoute/>}>
            <Route path='/story/edit/:blogId' element={<Editor/>}></Route>
          </Route>
          <Route path="/" element={<ProtectedRoute/>}>
            <Route path='/story/read/:blogId' element={<ViewStory/>}></Route>
          </Route>
          <Route path="/" element={<ProtectedRoute/>}>
            <Route path="/library" element={<Library/>}></Route>
          </Route>
          <Route path="/" element={<ProtectedRoute/>}>
            <Route path="/:userId/about" element={<Profile/>}></Route>
          </Route>
          <Route path="/" element={<ProtectedRoute/>}>
            <Route path="/:userId/about-you" element={<Profile/>}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
