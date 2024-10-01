import { useNavigate } from 'react-router-dom';
import './index.scss';
import { TiTick } from "react-icons/ti";
import { useRef } from 'react';

const Success = ({storyId, isScheduled}) => {
    const navigate = useNavigate();
    const successRef = useRef();

    // const handleClickOutside = (event) => {
    //     if (successRef.current && !successRef.current.contains(event.target)) {
    //         setShowDropdown(false); 
    //     }
    //   };
    
    // useEffect(() => {
    // document.addEventListener('mousedown', handleClickOutside);
    // return () => {
    //     document.removeEventListener('mousedown', handleClickOutside);
    // };
    // }, []);
    
    return(
        <>
                <div className='modal-overlay'></div>
                <div className="success-wrapper" ref={successRef}>
                <div className='icon'><TiTick style={{fontSize:"20px", color:"white"}}/></div>
                <p>Your story is successfully {isScheduled ? `scheduled for publish .` : 'published .'} </p>
                <div className='btn-contr'>
                    <button onClick={() => navigate(`/story/read/${storyId}`)} style={{color:"green", marginRight:"30px"}}>View Story</button>
                    <button onClick={() => navigate('/join')}>Home</button>
                </div>
                </div>
        </>

    )
}

export default Success