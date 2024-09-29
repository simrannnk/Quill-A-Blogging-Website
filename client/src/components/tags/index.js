import './style.scss';
import axiosInstance from '../../service/api';

const Tags = ({setAllBlogs}) => {

    const searchWithTag = async (tagVal) => {
        await axiosInstance
            .post("/api/blog/search", {searchQuery: tagVal})
            .then((res) => {
            setAllBlogs(res.data.blogs);
            })
            .catch((err) => {
                console.log("error is", err);
            });
    }

    return(
        <div className="tags-container">
            <div className="heading">Search with Popular Tags</div>
            <div className='all-tags'>
            {['Web','React','MERN','Node', 'Frontend Development'].map((ele) => {
                return <div className="tags" onClick={() => searchWithTag(ele)}>{ele}</div>
            })}
            </div>
 
        </div>
    )
}

export default Tags;