import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LandingPage from './components/landingPage/LandingPage';
import Home from './components/home/Home';
import Posts from './components/posts/Posts';
import Profiles from './components/profiles/Profiles';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" exact element={<LandingPage />} />
        <Route path="/Profiles" exact element={<Profiles />} />
        <Route path="/Posts" exact element={<Posts />} />
        <Route path="/Home" exact element={<Home />} />
      </Routes>
    </BrowserRouter>
  );  
}

export default App;
