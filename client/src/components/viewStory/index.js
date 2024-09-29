import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import axiosInstance from "../../service/api";
import './style.scss';
import Navbar from "../navbar";
import moment from 'moment';
import { PiHandsClappingThin } from "react-icons/pi";
import { MdOutlineBookmarkAdd } from "react-icons/md";


const ViewStory = () => {
    const { blogId } = useParams();
    const [blogData, setBlogData] = useState({});
    const userInfo = JSON.parse(localStorage.getItem('userAuth')) || {};

    const getBlogById = async () => {
        await axiosInstance.get("/api/blog/getBlog", {
            params: {
                id: blogId
              },
        }).then((res) => {
           setBlogData(res.data.draft)
          }).catch((err) => {
            console.log("error is", err)
          })
      }

      const formattedDate = (date) => {
        return  moment(date).format('DD MMMM YYYY'); // Example: "19 September 2024"
    }

      
    useEffect(() => {
        getBlogById();
    },[])

    return(
        <>
        <Navbar/>
        <div className="view-story">
            <div className="title">{blogData.title}</div>
            <div className="wrapper">
                <div className="about-contr">
                    <div className='user-inital'>{(userInfo.userName).substring(0,1)}</div>
                    <div className="contr">
                        <div className="user-name">{userInfo.userName}</div>
                        <div className="publish-date">{formattedDate(blogData.publishedOn)}</div>
                    </div>
                </div>
                <div className="action-contr">
                    <div className="claps">
                        <PiHandsClappingThin style={{marginRight:'5px', fontSize:'20px'}}/>
                        <span>{blogData.clapCount}</span>
                    </div>
                    <div className="bookmark" style={{fontSize:"20px"}}>
                        <MdOutlineBookmarkAdd/>
                    </div>
                </div>
            </div>
            <div className="tags-contr">
                 {blogData.tags?.map((ele) => {
                    return <div className="tag">{ele}</div>
                })}
            </div>
            <div className="content-contr" dangerouslySetInnerHTML={{__html: blogData.content}}/>

        </div>
        </>

    )
}

export default ViewStory