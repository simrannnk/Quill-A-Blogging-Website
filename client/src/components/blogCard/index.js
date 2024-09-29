import './style.scss';
import { useEffect, useState } from 'react';
import { FaHandsClapping } from "react-icons/fa6";
import { FaComment } from "react-icons/fa";
import { MdOutlineBookmarkAdd } from "react-icons/md";
import axiosInstance from '../../service/api';
import { PiHandsClappingThin } from "react-icons/pi";
import { FaBookmark } from "react-icons/fa";
import moment from 'moment';


const BlogCard = ({blogData, userDetails, allBlogs, setAllBlogs}) => {
    const userInfo = JSON.parse(localStorage.getItem('userAuth')) || {};
    const [isLiked, setIsLiked] = useState(false);
    const [blogClaps, setBlogClaps] = useState(0);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [followingUser, setFollowingUser] = useState([]);

    const handleLikeBlogs = async () => {
        const payload = {
            user_id: userInfo.user_id,
            blogId: blogData._id,
            like: !isLiked
          };
          await axiosInstance.post("/api/blog/likeBlog", payload).then((res) => {
 
          }).catch((err) => {
            console.log("error is", err)
          })
    }

    const handleBookmarkBlogs = async () => {
        const payload = {
            user_id: userInfo.user_id,
            blogId: blogData._id,
            bookmark: !isBookmarked
          };
          await axiosInstance.post("/api/blog/bookmark", payload).then((res) => {
 
          }).catch((err) => {
            console.log("error is", err)
          })
    }

    const handleBookmark = async() => {
        handleBookmarkBlogs();
        setIsBookmarked(prev => !prev);
    }

    const handleClaps = () => {
        handleLikeBlogs();
        if(isLiked){
            setBlogClaps((prev) => prev-1);
        }
        else setBlogClaps((prev) => prev+1);
        setIsLiked(prev => !prev);
    }

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

    useEffect(() => {
        if(blogData){
            setIsLiked(blogData.clapsBy.includes(userInfo.user_id));
            setBlogClaps(blogData.clapCount);
            setIsBookmarked(blogData.savedBy.includes(userInfo.user_id));
        }
    },[blogData])

    useEffect(() => {
        setFollowingUser(userDetails?.following)
    },[userDetails])

    // useEffect(() => {
    //     const followingData = userDetails?.following;
    //     console.log("follwoing data", followingData);
    //     setFollowingUser(followingData);
    // },[])


    const updateUserData = async (id, unfollow) => {
        const payload = {
            firstUser: userInfo.user_id,
            secondUser: id,
            unfollow: unfollow
            };
     
            await axiosInstance.post("/api/user/update", payload).then((res) => {
                // setAllBlogs([]);
            }).catch((err) => {
            console.log("error is", err)
            })
    }

    const handleFollow = () => {
        updateUserData(blogData.authorId, false);
        setFollowingUser([...followingUser, blogData.authorId])
    }

    const handleUnfollow = (id) => {
        updateUserData(blogData.authorId, true);
        const newFollowing = followingUser.filter((item) => {
            return item !== blogData.authorId;
        })
        setFollowingUser(newFollowing);
    }
    
    return(
        <div className="card-contr">
            <div className='author-info'>
                <>
                    <img src='https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDJ8fHxlbnwwfHx8fHw%3D'></img>
                    <a className='name' href={`/@${blogData.authorId}/about`} >{blogData.author}</a>
                </>
                <div className='follow-contr'>
                    <span>.</span><div style={{cursor:"pointer"}} onClick={followingUser?.includes(blogData.authorId) ? () => handleUnfollow() : () => handleFollow()}>{followingUser?.includes(blogData.authorId) ? 'Following' : 'Follow'}</div>
                </div>

            </div>
            <div className='about-blog'>
                <div className='about-contr'>
                    <a className='head' href={`/story/read/${blogData._id}`}>
                        <p className='title'>{blogData.title}</p>
                        <p className='desc' dangerouslySetInnerHTML={{__html: getHtmlContent(blogData.content).content}}/>
                    </a>
                    <div className='bottom'>
                        <div className='activity'>
                            <div className='date'>{formattedDate(blogData.publishedOn)}</div>
                            <div className='claps'>{isLiked ? <FaHandsClapping style={{marginRight:'5px', color: "rgb(81 189 224)", fontSize:'18px', cursor:"pointer", marginRight:"4px"}} onClick={() => handleClaps()} /> : <PiHandsClappingThin style={{fontSize:'18px', cursor:"pointer", marginRight:"4px"}} onClick={() => handleClaps()} />}{blogClaps}</div>
                            {/* <div className='comments'><FaComment style={{marginRight:'5px', color:"1598c3", fontSize:'16px'}}/>23</div> */}

                        </div>
                        <button className='bookmark'>
                            {isBookmarked ? <FaBookmark style={{fontSize:"14px", cursor:"pointer", color:"green"}} onClick={() => handleBookmark()}/> : <MdOutlineBookmarkAdd style={{color:"grey", fontSize:"20px", cursor:"pointer"}} onClick={() => handleBookmark()}/>}
                        </button>
                    </div>
     
                </div>
                <div className='img-contr'>
                    <img src='https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cmVhY3R8ZW58MHx8MHx8fDA%3D'></img>
                </div>
 

            </div>
        </div>
    )
}

export default BlogCard;