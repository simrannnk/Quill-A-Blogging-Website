import Navbar from "../../components/navbar";
import React, { useEffect, useState } from "react";
import "./style.scss";
import axiosInstance from "../../service/api";
import StoryCard from "./StoryCard.js";

const Stories = () =>  {
    const userInfo = JSON.parse(localStorage.getItem('userAuth')) || {};
    const [allBlogs,setAllBlogs] = useState([]);
    const [selectedTab, setSelectedTab] = useState('Published')

    const getAllBlogsData = async () => {
        await axiosInstance
          .post("/api/blog/getAllBlogs", {authorId: userInfo.user_id, selfBlog: true})
          .then((res) => {
            console.log("res is", res);
            setAllBlogs(res && res.data && res.data.allBlogs);
          })
          .catch((err) => {
            console.log("error is", err);
          });
      };

      const getTabContent = (allBlogs, key) => {
        // const dateKey = key === 'Published' ? 'publishedOn' : 'createdOn';
        // const sortedBlog = allBlogs.sort((a,b) => b[dateKey] - a[dateKey] )
        const filterContent = allBlogs && allBlogs.filter((ele) => {
            return ele.status === key.toLowerCase();
        })
        return filterContent;
      }

    useEffect(() => {
        console.log("helo world");
        getAllBlogsData();
    },[])

    return(
        <React.Fragment>
            <Navbar/>
            <div className="story-container">
                <div className="head">
                    <p>Your stories</p>
                    <a href="/new-story" className="write-story">Write a story</a>
                </div>
                <div className="tab-list">
                    { ["Published","Drafts","Scheduled"].map((item, idx) => {
                        return <div className={`tab ${item === selectedTab && 'selected'}`} onClick={() => setSelectedTab(item)}>{item}{getTabContent(allBlogs, item)?.length > 0&& <div className="blog-count">{getTabContent(allBlogs, item).length}</div>}</div>
                    })}
                </div>
                <div className="content-contr">
                    {/* {allBlogs && allBlogs.filter((item) => {
                        if(item.status === selectedTab.toLowerCase()){
                            return(
                                <div>
                                    Helo
                                </div>
                            )
                        }
                    })} */}
                    {getTabContent(allBlogs, selectedTab)?.length > 0 && getTabContent(allBlogs, selectedTab).map((ele) => {
                        return <StoryCard selectedTab={selectedTab} draft={ele} allBlogs={allBlogs} setAllBlogs={setAllBlogs}/>
                    })}
                    {getTabContent(allBlogs, selectedTab).length === 0 && 
                        <div className="no-blog-text">
                            <p className="primary">{selectedTab === 'Published' ? 'No published blog to show' : selectedTab === 'Drafts' ? 'No drafted blog to show' : 'No scheduled blogs to show'}</p>
                            <p className="secondary">{selectedTab === 'Published' ?  "Publish your story and it will appear here." : selectedTab === 'Drafts' ? 'Draft a story and it will appear here.' : 'Schedule your story for publishing later and it will appear here.'}</p>
                        </div>
                    }
                </div>


            </div>
        </React.Fragment>

    )
}

export default Stories;