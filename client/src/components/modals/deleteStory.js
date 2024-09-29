import './index.scss';
import axiosInstance from '../../service/api';


const DeleteStory = ({setShowDeleteModal, storyId, allBlogs, setAllBlogs, setShowAlert}) => {

    const handleDelete = async () => {
      const payload = {
        draftId: storyId
      }
      await axiosInstance.post("/api/blog/deleteDraft", payload).then((res) => {
        setAllBlogs(allBlogs.filter((item) =>  item._id !== storyId));
        setShowAlert(true);
        setShowDeleteModal(false);
        }).catch((err) => {
        console.log("error is", err)
        })
    };


    return(
        <>
        <div className='modal-overlay'></div>
        <div className="delete-story">
            <p className='del-head'>Delete Story</p>
            <p className='del-subHead'>Deletion is not reversible, and the story will be completely deleted.</p>
            <div className='btn-contr'>
                <button className='action-cta cancel-cta' onClick={() => setShowDeleteModal(false)}>Cancel</button>
                <button className='action-cta delete-cta' onClick={() => handleDelete()}>Delete</button>
            </div>
        </div>
        </>

    )
}

export default DeleteStory;