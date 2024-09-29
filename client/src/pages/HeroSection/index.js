import Navbar from '../../components/navbar';
import './style.scss';
import { useTypewriter, Cursor } from "react-simple-typewriter";
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
    const [text] = useTypewriter({
        words: [
          "WRITE .",
          "SHARE .",
          "INSPIRE .",
        ],
        loop: {},
      });

      const userInfo = JSON.parse(localStorage.getItem('userAuth')) || {};
      const navigate = useNavigate();

    return(
        <div className="hero-section">
            <Navbar/>
      <div className="inner">
        <div className="text-container">
          <h1 className="head">
            <span style={{ color: "black", fontWeight: "800" }}>
              {text} <Cursor />
            </span>
          </h1>
          <p className="para">Where Stories Come to Life</p>
          <div className="btn-container">
            <button className="btn1" onClick={() => userInfo.isAuthenticated ? navigate('/new-story') : navigate('/')}>Start Writting</button>
          </div>
      
        </div>
        <div className="image-container">
          <img src="https://images.unsplash.com/reserve/LJIZlzHgQ7WPSh5KVTCB_Typewriter.jpg?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8YmxvZyUyMHdyaXR0aW5nfGVufDB8fDB8fHww"></img>
        </div>
      </div>
      <div className='footer'>Write . Share . Inspire</div>
        </div>
    )
}

export default HeroSection;


