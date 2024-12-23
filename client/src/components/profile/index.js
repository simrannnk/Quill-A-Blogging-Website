import Navbar from "../navbar";
import './style.scss';
import axiosInstance from "../../service/api";
import { useEffect, useState } from "react";
import StoryCard from "../../pages/Stories/StoryCard";
import moment from "moment";
import { useParams } from "react-router-dom";

const Profile = () => {
    const userInfo = JSON.parse(localStorage.getItem('userAuth')) || {};
    const { userId } = useParams();
    const path = window.location.href;
    const [selectedTab, setSelectedTab] = useState('Home')
    const [allBlogs, setAllBlogs] = useState([])
    const [addAbout, setAddAbout] = useState(false);
    const [userData, setUserData] = useState({});
    const [aboutText, setAboutText] = useState("");
    const [followingList, setFollowingList] = useState([]);
    const [followersList, setFollowersList] = useState([]);
    const [aboutAdded, setAboutAdded] = useState(false);
    const [maskedEmail, setMaskedEmail] = useState("");


    // useEffect(() => {
    //     const textarea = document.getElementById('autoResizeTextarea');

    //     if(aboutText.length > 0 ){
    //         textarea.addEventListener('input', function() {
    //             this.style.height = 'auto';  // Reset the height
    //             this.style.height = (this.scrollHeight - 30) + 'px';  // Set new height based on scrollHeight
    //         });
    //     }
    //     else {
    //         textarea.style.height = '20px'
    //     }
    // },[aboutText])


    useEffect(() => {
       if(path.includes('about-you')){
        getUserDetails(userInfo.user_id);
       }
       else getUserDetails(userId.replace('@', ''))
    },[])

    const getAllBlogsData = async () => {
        await axiosInstance
          .post("/api/blog/getAllBlogs", {authorId: userData._id, selfBlog: true})
          .then((res) => {
            setAllBlogs(res && res.data && res.data.allBlogs);
          })
          .catch((err) => {
            console.log("error is", err);
          });
      };


      const getUserDetails = async (userId) => {
        await axiosInstance
          .get(`/api/user/${userId}/details`)
          .then((res) => {
            setUserData(res.data.user);
          })
          .catch((err) => {
            console.log("error is", err);
          });
      };

      const getUserList =  async (list, type) => {
        await axiosInstance
          .post(`/api/user/list`, { userList : list } )
          .then((res) => {
            if(type === 'following'){
                setFollowingList(res.data.userData);
            }
            else setFollowersList(res.data.userData);
          })
          .catch((err) => {
            console.log("error is", err);
          });
      };

      useEffect(() => {
        if(userData && userData.followers && userData.following){
            console.log("result is", userData.followers, userData.following)
            getUserList(userData.followers, 'followers');
            getUserList(userData.following, 'following');
        }
        setAboutAdded(userData?.about?.length > 0)
        setAboutText(userData?.about)
        if(userData && userData._id){
            selectedTab === 'Home' && getAllBlogsData();
        }
      },[userData])

      const formattedDate = (date) => {
        return  moment(date).format('DD MMMM YYYY'); // Example: "19 September 2024"
    }

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

    const handleAboutSave = async () => {
        const payload = {
            userId: userData._id,
            aboutUser: aboutText
        };
         
        await axiosInstance.post("/api/user/about", payload).then((res) => {
            setAboutAdded(true);
        }).catch((err) => {
        console.log("error is", err)
        })
    }

    return(
        <>
            <Navbar/>
            <div className="user-profile">
                <div className="left">
                <div className="user-name">{((userData.userName))}</div>
                <div className="tab-list">
                    { ["Home", "About"].map((item, idx) => {
                        return <div className={`tab ${item === selectedTab && 'selected'}`} onClick={() => setSelectedTab(item)}>{item}</div>
                    })}
                </div>
                <div className="content-contr">
                        {
                            selectedTab === 'Home' && 
                            allBlogs.map((ele) => {
                                return <StoryCard aboutPage="true" selectedTab={selectedTab} draft={ele} allBlogs={allBlogs} setAllBlogs={setAllBlogs}/>
                            })
                        }
                        {
                            (selectedTab === 'Home' && allBlogs.length === 0) && 
                            <div className="no-blog-text">
                                <p className="primary">No published blog to show</p>
                                <p className="secondary"> Publish your story and it will appear here.</p>
                            </div>
                        }
                        {
                            selectedTab === 'About' && !aboutAdded && 
                           <div className="about-wrapper">
                                {addAbout ? 
                                <div className="add-wrapper">
                                         <textarea placeholder='Add a brief about you ...' value={aboutText} 
                                            id='autoResizeTextarea' onChange={(e) => setAboutText(e.target.value)} 
                                        />
                                        <div className="btn-contr">
                                            <button onClick={() => {setAboutText("");setAddAbout(false)}}>Cancel</button>
                                            <button onClick={() => handleAboutSave()}>Save</button>
                                        </div>
                                </div>
                                : <div className="banner">
                                    <p>Tell the world about yourself</p>
                                    {/* <div className="bookmark">
                                        <MdOutlineBookmarkAdd style={{fontSize:'28px', backgroundColor:'white', borderRadius:'50%', padding:'8px'}}/>
                                    </div> */}
                                    <p className="text">
                                    Here’s where you can share more about yourself: your history, work experience, accomplishments, interests, dreams, and more.
                                    <button onClick={() => setAddAbout(true)}>Get Started</button>
                                    </p>
                                </div>}
                            </div>
                        }
                        {
                            selectedTab === 'About' &&                             
                                aboutAdded && 
                                <div className="about-user">
                                    {aboutText}
                                </div>
                        }
                </div>
                </div>
                <div className="right">
                    <div className="user-info">
                        <div className="user-initial"><div>{(userData?.userName)?.substring(0,1)?.toUpperCase()}</div></div>
                        <div className="userName">
                            <div>{userData.userName}</div>
                            <div style={{marginTop:"3px", fontWeight:"400", fontSize:"13px"}}>{maskEmail(userInfo.userId)}</div>
                        </div>
                    </div>
                    <div className="join-info">Joined Quill on <span>{formattedDate(userData?.joinedOn)}</span></div>
                    <div className="follow-info">
                        <span>{userData?.followers?.length} {userData?.followers?.length === 1 ? "Follower" : "Followers"}</span>
                        <span style={{margin:"0 4px", fontSize:"30px"}}>.</span>
                        <span>{userData?.following?.length} Following</span>
                    </div>
                    <button className="edit-profile">Edit Profile</button>
                    {followersList?.length > 0 && <div className="follow-wrapper">
                        <div className="head">Members who follow you</div>
                        {
                           followersList.map((ele) => {
                            return <div className="user-card">
                                <div className="initial"><div>{(ele.userName).substring(0,1).toUpperCase()}</div></div>
                                <div className="name">{ele.userName}</div>
                                
                                </div>
                           })
                        }
                    </div>}
                    {followingList?.length > 0 && <div className="following-wrapper">
                        <div className="head">Members whom you follow</div>
                        {
                            followingList.map((ele) => {
                                return <div className="user-card">
                                <div className="initial"><div>{(ele.userName).substring(0,1)}</div></div>
                                <div className="name">{ele.userName}</div>
                                
                                </div>
                            })
                        }
                    </div>}
                </div>

            </div>
        </>

    )
}

export default Profile;