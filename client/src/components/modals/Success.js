import { useNavigate } from 'react-router-dom';
import './index.scss';
import { TiTick } from "react-icons/ti";

const Success = ({storyId, isScheduled}) => {
    const navigate = useNavigate();
    return(
        <>
                <div className='modal-overlay'></div>
                <div className="success-wrapper">
                <div className='icon'><TiTick style={{fontSize:"20px", color:"white"}}/></div>
                <p>Your story is successfully {isScheduled ? `scheduled for publish .` : 'published .'} </p>
                <div className='btn-contr'>
                    <button onClick={() => navigate(`/story/read/${storyId}`)} style={{color:"green", marginRight:"30px"}}>View Story</button>
                    <button onClick={() => navigate('/home')}>Home</button>
                </div>
                </div>
        </>

    )
}

export default Success