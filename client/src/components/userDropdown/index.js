import './style.scss';
import { CiUser } from "react-icons/ci";
import { IoBookmarksOutline } from "react-icons/io5";
import { PiNotepadLight } from "react-icons/pi";
import { IoSettingsOutline } from "react-icons/io5";
import { useRef, useState, useEffect } from 'react';
import { RxCross2 } from "react-icons/rx";
import { useNavigate } from 'react-router-dom';

const UserDropdown = (props) => {

    const {setShowDropdown} = props;
    const naviagte = useNavigate();
    const dropdownRef = useRef(null);
    const userInfo = JSON.parse(localStorage.getItem('userAuth')) || {};

    const list = [
        {
            name: "Profile",
            logo: <CiUser/>,
            link: `/@${userInfo.userId.substring(0, (userInfo.userId).indexOf('@'))}/about-you`
        },
        {
            name: "Library",
            logo: <IoBookmarksOutline/>,
            link: "/library"
        },
        {
            name: "Stories",
            logo: <PiNotepadLight/>,
            link: "/stories"
        },
        // {
        //     name: "Settings",
        //     logo: <IoSettingsOutline/>,
        //     link: ""
        // },
        {
            name: "Sign out",
            logo: null,
            link: "/"
        }
    ]


  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false); 
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


    const maskEmail = (email) => {
        const [localPart, domain] = email.split('@'); // Split email into local part and domain part
        const visibleLength = 3;  // Number of visible characters in the local part
        
        if (localPart.length <= visibleLength) {
          // If the local part is too short, mask it completely
          return '*'.repeat(localPart.length) + '@' + domain;
        }
      
        // Mask the local part by showing the first few characters and replacing the rest with '*'
        const visiblePart = localPart.slice(0, visibleLength);
        const maskedPart = '*'.repeat(localPart.length - visibleLength);
      
        return `${visiblePart}${maskedPart}@${domain}`;
    };

    const handleItemClick = (item) => {
        if(item.name === 'Sign out'){
            localStorage.removeItem("userAuth");
        }
        naviagte(item.link);
    }

    return(
        <>
        <div className='modal-overlay'></div>
        <div className="dropdown-contr" ref={dropdownRef}>
            <div className='list-contr'>
                {list && list.map((item) => {
                    return(
                        <li className='list-item' >
                            {item.logo && <div className='logo'>{item.logo}</div>}
                            <div className='name' onClick={() => handleItemClick(item)}>{item.name}</div>
                        </li>
                    )
                })}
            </div>
    
            <li className='masked-email'>{maskEmail(userInfo.userId)}</li>

            <RxCross2 style={{position:"absolute", top:"12px", right:"12px", color:"grey", cursor:"pointer"}} onClick={() => setShowDropdown(false)}/>
        </div>
        </>

    )
}

export default UserDropdown;