import { useState, useRef } from "react";
import './style.scss';
import { RxCross2 } from "react-icons/rx";
import axiosInstance from "../../service/api";
import Success from "../modals/Success";
import DateTime from "../dateTime";
import { useNavigate } from "react-router-dom";

const PublishStory = ({getContentToRender, draftId, draftContent, draftTitle}) => {
    const navigate = useNavigate();
    const [storyTags, setStoryTags] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const fileInputRef = useRef(null);
    const [image, setImage] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [showSchedule, setShowSchedule] = useState(false);
    const [isScheduled, setIsScheduled] = useState(false);

    const userInfo = JSON.parse(localStorage.getItem('userAuth')) || {};

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && inputValue.trim() !== '') {
            e.preventDefault();
      
            setStoryTags([...storyTags, inputValue.trim()]);
            setInputValue('');
        }
    }

    const removeTag = (indexToRemove) => {
       const result = storyTags.filter((ele,idx) => {
        return idx !=indexToRemove;
       })
       setStoryTags(result);
    }

    const handleClick = () => {
        fileInputRef.current.click(); // Trigger the file input click
    };

    const handleFileChange = (event) => {
        setImage(URL.createObjectURL(event.target.files[0]))
    }

    const getDraftById = async () => {
        await axiosInstance.get("/api/blog/getBlog", {
            params: {
                id: draftId
              },
        }).then((res) => {
           getContentToRender(false, res.data);
          }).catch((err) => {
            console.log("error is", err)
          })
    }

    const publishBlog = async (blogId) => {
        const payload = {
            storyTags: storyTags,
            bannerImage: image
        }
        try {
          const response = await axiosInstance.post(`/api/blog/${blogId}/publish`, payload);
          setShowSuccess(true);
          console.log('Blog published:', response.data);
        } catch (error) {
          console.error('Error publishing the blog:', error);
        }
    };


    const getHtmlContent = (html) => {
        const strippedContent = html.replace(/<[^>]*>?/gm, '').trim();
        return {
            content : strippedContent.substr(0, 50),
            length: strippedContent.length
        }  // Check if there's any content left
    };


    const saveInCloudinary = () => {
        const data = new FormData();
        data.append()
    }

    return(
    <>
        {showSuccess && <Success storyId={draftId} isScheduled={isScheduled} />}
        <div className="publish-story">
            <div className="cross-icon" onClick={() => getDraftById()}><RxCross2 style={{fontSize:"20px", cursor:"pointer"}}/></div>
            <div className="wrapper">
                <div className="left-contr">
                    <div className="heading">Story Preview</div>
                    {!image && <div className="input-contr">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="file-input"
                            accept="image/*" 
                        />
                        <button onClick={handleClick} className="custom-upload-button">
                            Include a banner image in your story to make it more inviting to readers.
                        </button>
                    </div>}

                    {image && <div className="banner-contr">
                        <img src={image} className="banner-img"></img>
                        <button className='upload-new' onClick={() => setImage('')}>Change Preview Image</button>
                    </div>}

                    <div className="about-blog">
                        <div className="title">{draftTitle}</div>
                        <div className="content">{getHtmlContent(draftContent).content}{getHtmlContent(draftContent).length > getHtmlContent(draftContent).content.length ? '...' : ''}</div>
                    </div>
                    {/* <button style={{color:"#de2b2b", border:"none", backgroundColor:"white", textAlign:"right"}} onClick={() => navigate()}>Edit your story</button> */}

                </div>
                <div className="right-contr">
                    <div className="heading">Publishing to : <span style={{fontWeight:'600'}}>{userInfo.userName}</span></div>
                    <div className="sub-heading">Add tags (up to 3) so that readers know what your story is about.</div>
                    <input 
                        placeholder="Add a tag ..."
                        value={inputValue}
                        onKeyDown={handleKeyDown}
                        onChange={(e) => setInputValue(e.target.value)}
                    />
                    {storyTags && storyTags.length > 0 && <div className="tag-list">
                        {
                            storyTags.map((ele, idx) => {
                                return <span className="tags">{ele}
                                    <button className="cross-button" onClick={() => removeTag(idx)}><RxCross2 style={{fontSize:"11px", marginLeft:"6px"}}/></button>
                                </span>
                            })
                        }
                    </div>}
                
                    <div className="btn-contr">
                        <button className="publish-cta" disabled={image.length === 0 ||  storyTags.length < 3} onClick={() => publishBlog(draftId)}>Publish now</button>
                        <button style={{backgroundColor:"white", border:"none"}} onClick={() => setShowSchedule(true)}>Want to schedule the publish for later ?</button>
                    </div>
                    {
                        showSchedule &&
                        <>
                                                <DateTime setIsScheduled= {setIsScheduled} setShowSuccess={setShowSuccess} disabled={image.length === 0 || storyTags.length < 3} blogId = {draftId} />
                        </> 

                    }
                </div>
            </div>
        </div>
        </>
    )
}

export default PublishStory;