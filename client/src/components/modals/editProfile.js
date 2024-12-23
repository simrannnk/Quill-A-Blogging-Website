import './index.scss';
const EditProfile = () => {
    return(
        <>
        <div className="modal-overlay"></div>
        <div className="edit-profile">
            <div className="head">Profile Information</div>
            <div className="img-container">
                <p className="head">Photo</p>
                <div className="wrapper">
                <div className="profile-img">S</div>
                <div>
                    <button>Update</button>
                    <button>Remove</button>
                </div>
                </div>
            </div>
        </div>
        </>

    )
}

export default EditProfile