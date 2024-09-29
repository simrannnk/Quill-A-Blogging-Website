import Navbar from '../navbar';
import Card from './card';
import './style.scss'
import { MdOutlineBookmarkAdd } from "react-icons/md";
import axiosInstance from '../../service/api';
import { useEffect, useState } from 'react';
import { FaLessThanEqual } from 'react-icons/fa';

const Library = () => {
    const userInfo = JSON.parse(localStorage.getItem('userAuth')) || {};
    const [allBlogs, setAllBlogs] = useState([]);
        
    const getAllBlogsData = async () => {
        await axiosInstance
          .post("/api/blog/getAllBlogs", {authorId: userInfo.user_id, selfBlog: false })
          .then((res) => {
            const result = res.data.allBlogs.filter((item) => {
                return item.savedBy.includes(userInfo.user_id);
            })
            setAllBlogs(result);
          })
          .catch((err) => {
            console.log("error is", err);
          });
    };

      useEffect(() => {
        getAllBlogsData();
      },[])

    return(
        <>
            <Navbar/>
            <div className="library-contr">
                <div className='head'>Your Library</div>
                <div className="library-wrapper">
                        <div className="banner">
                            <p>Save stories to easily organize and share.</p>
                            <div className="bookmark">
                                <MdOutlineBookmarkAdd style={{fontSize:'28px', backgroundColor:'white', borderRadius:'50%', padding:'8px'}}/>
                            </div>
                        </div>
   
                </div>
                {allBlogs.length > 0 && <div className='tab-list'>
                    <div className='tab'>Saved story</div>
                </div>}
                {allBlogs.length > 0 && allBlogs.map((blogData) => {
                    return <Card blogData={blogData}/>
                })}
            </div>
        </>

    )
}

export default Library;