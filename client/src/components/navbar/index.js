import { useState } from 'react';
import './index.scss';
import { FaPenToSquare } from "react-icons/fa6";
import UserDropdown from '../userDropdown';
import { useNavigate } from 'react-router-dom';
import { GoHome } from "react-icons/go";

const Navbar = (props) => {
    const navigate = useNavigate();
    const {page, getHtmlContent, blogTitle, blogContent, getContentToRender} = props;
    const [showDropdown, setShowDropdown] = useState(false);
    const userInfo = JSON.parse(localStorage.getItem('userAuth')) || {};

    const openUserDropdown = () => {
        setShowDropdown(prev => !prev);
    }

    return(
        <div className = "nav-container">
            <div className='left' onClick={() => navigate('/quill')} style={{cursor:"pointer"}}>
                <img src='/feather-icon.png' className='app-logo'></img>
                <div className='app-name'>Quill.</div>
            </div>
            {!userInfo.isAuthenticated  && <div className='right'>
            {["Write", "Sign in", "Get Started"].map((item, idx) => {
                    return(
                        <button className={idx === 2 && 'get-started'} onClick={() => navigate('/join')}>
                            {idx === 0 && <FaPenToSquare style={{marginRight:"5px"}}/>}
                            {item}</button>
                    )
                })}
            </div>}
                
                {userInfo.isAuthenticated && <div className='right'>
                    {
                        page !== 'newStory' && 
                            <button onClick={() => navigate('/new-story')}>
                                <FaPenToSquare style={{marginRight:"5px"}}/>
                                Write</button>
                    }
                                       {
                        page !== 'home' && 
                            <button onClick={() => navigate('/join')}>
                                <GoHome style={{marginRight:"5px", fontSize:"17px"}}/>
                                Home</button>
                    }
                    {page === 'newStory' && 
                        <>
                            <button className='publish-btn' disabled={!blogTitle || !getHtmlContent(blogContent) || getHtmlContent(blogContent).length < 30} onClick={() => getContentToRender(true)}>Publish</button>
                            {/* <button className='publish-btn' disabled={!blogTitle || !getHtmlContent(blogContent)}>Schedule</button> */}
                        </>
                    }
                    {userInfo && userInfo.isAuthenticated && <button className='user-inital' onClick={() => setShowDropdown(prev => !prev)}><div>{(userInfo.userName).substring(0,1).toUpperCase()}</div></button>}

                    {showDropdown && <UserDropdown setShowDropdown={setShowDropdown}/>}
                </div>}

        </div>
    )
}

export default Navbar;