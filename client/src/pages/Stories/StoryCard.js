
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from 'moment';
import { FaHandsClapping } from "react-icons/fa6";
import DeleteStory from "../../components/modals/deleteStory";


const StoryCard = ({draft, allBlogs, setAllBlogs, getContentToRender, selectedTab, aboutPage}) => {

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const naviagte = useNavigate();

    const getHtmlContent = (html) => {
        const strippedContent = html.replace(/<[^>]*>?/gm, '').trim();
        return {
            content : strippedContent.substr(0, 200),
            length: strippedContent.length
        }  
    };

    const formattedDate = (date) => {
        return  moment(date).format('DD MMMM YYYY'); // Example: "19 September 2024"
    }

    const handleDeleteDraft = async (showd) => {
        setShowDeleteModal(true);
    } 

    //   useEffect(() => {
    //     if(deletedId.length > 0 && draftData.length > 0){
    //         const updatedData =  draftData.filter((item) => {
    //             return item._id !== deletedId;
    //         })
    //         console.log("updated data is", updatedData)
    //         setDraftData(updatedData);
    //     }

    //   },[deletedId])
    
    // const getDraftById = async () => {
    //     await axiosInstance.get("/api/blog/getBlog", {
    //         params: {
    //             id: draftId
    //           },
    //     }).then((res) => {
    //        getContentToRender(false, res.data);
    //       }).catch((err) => {
    //         console.log("error is", err)
    //       })
    // }

    const handleEditDraft = (id) => {
        naviagte(`/story/edit/${id}`)
    }

    const handleReadBlog = (id) => {
        naviagte(`/story/read/${id}`)
    }

    useEffect(() => {
        if(showAlert){
            setTimeout(() => {
                setShowAlert(false);
            }, 2000)
        }

    },[showAlert])
    return(
        <>
        <div className="draft-story">
            <p className="title">{(draft && draft.title) ? draft.title : "Untitled Story"}</p>
            <div className="outer-wrapper">
                <p className="content">{getHtmlContent(draft && draft.content).content}
                    {getHtmlContent(draft && draft.content).length > getHtmlContent(draft && draft.content).content.length ? '...' : ''}
                </p>
                <div className="footer">
                    <div style={{display:"flex"}}>
                        <div className="date" style={{marginRight:"50px"}}>{selectedTab === 'Published' ? `Published on ${formattedDate(draft.publishedOn)}` : `Created on ${formattedDate(draft.createdOn)}`}</div>
                        <div className='claps' style={{fontSize:"13px", fontWeight:"500", color: "grey", display: "flex"}}><FaHandsClapping style={{color:"#27a0c8", marginRight:'6px', fontSize:"16px"}}/>32</div>
                    </div>

                    <div className="btn-contr">
                        <button onClick={() => selectedTab === 'Drafts' ? handleEditDraft(draft._id) : handleReadBlog(draft._id)} className="edit-story">{selectedTab === 'Published' ? 'Read' : 'Edit'}</button>
                        {/* {selectedTab === 'Scheduled' && <button style={{color:"black" }} onClick={() => handleReadBlog(draft._id)} className="edit-story">Read</button>} */}
                        {!aboutPage && <button onClick={() => handleDeleteDraft()}>Delete</button>}
                    </div>
                </div>
           
            </div>
        </div>
        {showAlert && 
            <div className="alert-wrapper">Story is deleted succesfully <span style={{fontSize:"16px", cursor:"pointer"}} onClick={() => setShowAlert(false)}>×</span></div>
        
        }
        {showDeleteModal && <DeleteStory setShowAlert={setShowAlert} setShowDeleteModal={setShowDeleteModal} storyId={draft._id} allBlogs={allBlogs} setAllBlogs={setAllBlogs} /> }
        </>
    ) 
    
}

export default StoryCard;