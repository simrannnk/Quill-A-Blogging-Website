import './style.scss';
import { FaHandsClapping } from "react-icons/fa6";
import { FaBookmark } from "react-icons/fa";
import axiosInstance from '../../service/api';
import { useEffect, useState } from 'react';
import moment from 'moment';

const Card = ({blogData}) => {

    const [inputText, setInputText] = useState(blogData.notes);
    const [notesAdded, setNotesAdded] = useState(false);

    useEffect(() => {
        const textarea = document.getElementById('autoResizeTextarea');

        if(inputText.length > 0 ){
            textarea.addEventListener('input', function() {
                this.style.height = 'auto';  // Reset the height
                this.style.height = (this.scrollHeight - 30) + 'px';  // Set new height based on scrollHeight
            });
        }
        else {
            textarea.style.height = '20px'
        }
    },[inputText])

    const updateBlogNotes = async () => {
        const payload = {
            blogNotes: inputText
          };
          await axiosInstance.post(`/api/blog/${blogData._id}/add-notes`, payload).then((res) => {
            setNotesAdded(true);
          }).catch((err) => {
            console.log("error is", err)
          })
    }

    const formattedDate = (date) => {
        return  moment(date).format('DD MMMM YYYY'); // Example: "19 September 2024"
    }

    return(
        <div className="card-contr">
            <div className='todo-contr' style={inputText.length > 0 ? {"borderLeft": "3px solid black"} : {}}>
                <>
                    <textarea readOnly={notesAdded} placeholder='Add a note ...' value={inputText} 
                    id='autoResizeTextarea' onChange={(e) => setInputText(e.target.value)} 
                    onClick={() => setNotesAdded(false)} style={notesAdded ? {border: '1px solid #d5d5d5'} : {}}/>
                    <div className='btn-contr'>
                        <div className='done' onClick={updateBlogNotes}>Done</div>
                        <div className='cancel' onClick={() => setInputText(blogData.notes)}>Cancel</div>
                    </div>
                </>
            </div>
            <div className='header'>
                <div className='user-intial'>
                    <div>{(blogData.author).substring(0,1)}</div>
                </div>
                <div className='user-name'>{blogData.author}</div>
            </div>
            <a href={`/story/read/${blogData._id}`} className='about-contr'>
                <div className='heading'>{blogData.title}</div>
                <div className='description'>
                    Enough Talk ! Numbers are here ! Get detailed memory, CPU , app size and frame rate comparisons between Flutter and React Native
                </div>
            </a>

            <div className='action-contr'>
                <div className='left'>
                    <div className='publish-on'>{formattedDate(blogData.publishedOn)}</div>
                    <div className='claps'><FaHandsClapping style={{color:"#27a0c8", marginRight:'6px', fontSize:"16px"}}/>32</div>
                </div>
                <div className='right'>
                    <div className='bookmark'><FaBookmark style={{color:"green", fontSize:"16px"}} /></div>
                </div>

            </div>


        </div>
    )
}

export default Card;