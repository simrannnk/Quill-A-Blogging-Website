import Navbar from "../../components/navbar";
import Tags from "../../components/tags";
import Trending from "../../components/trending";
import "./style.scss";
import { MdOutlineBookmarkAdd } from "react-icons/md";
import BlogCard from "../../components/blogCard";
import { useEffect, useState } from "react";
import axiosInstance from "../../service/api";
import { useNavigate } from "react-router-dom";

const Landing = () => {
    const [allBlogs, setAllBlogs] = useState([]);
    const [userData, setUserData] = useState({});
    const naviagte = useNavigate();
    const userInfo = JSON.parse(localStorage.getItem('userAuth')) || {};
    
    const getAllBlogsData = async () => {
        await axiosInstance
          .post("/api/blog/getAllBlogs", {authorId: userInfo.user_id, selfBlog: false})
          .then((res) => {
            // const result = res.data.allBlogs.filter((item) => {
            //     return item.authorId !== userInfo.userId;
            // })
            setAllBlogs(res.data.allBlogs?.filter((item) => { return item.status === 'published' } ));
          })
          .catch((err) => {
            console.log("error is", err);
          });
      };
 
      const getUserDetails = async () => {
        await axiosInstance
          .get(`/api/user/${userInfo.user_id}/details`)
          .then((res) => {
            setUserData(res.data.user);
          })
          .catch((err) => {
            console.log("error is", err);
          });
      };

      useEffect(() => {
        getAllBlogsData();
        getUserDetails();
      },[])

    return(
        <div className="landingpage">
            <Navbar page="home" />
            <div className="content">
                <div className="left">
                   {allBlogs.map((ele) => {
                        return(
                            <BlogCard blogData={ele} userDetails={userData} allBlogs={allBlogs} setAllBlogs={setAllBlogs} />
                        )
                    })}
                </div>
                <div className="right">
                    <div className="library-contr">
                        <div className="banner">
                            <div>Writing on Quill</div>
                            <p>Discover stories that matter</p>
                            <p>Connect with readers</p>
                            <p>Write your thoughts</p>
                            <button onClick={() => naviagte('/new-story')}>Start Writing</button>
                        </div>
   
                    </div>
                    <Tags setAllBlogs={setAllBlogs} />
                    {/* <Trending/> */}
                </div>
            </div>
        </div>
    )
}


export default Landing;