import "quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import "./style.scss";
import { CiCirclePlus } from "react-icons/ci";
import { useEffect, useRef, useState } from "react";
import axiosInstance from "../../service/api";
import DateTime from "../dateTime";
import Navbar from "../navbar";
import PublishStory from "../PublishStory/PublishStory";
import { useParams } from "react-router-dom";

const Editor = () => {
  const quillRef = useRef(null);
  const titleRef = useRef(null);
  const [blogTitle, setBlogTitle] = useState('');
  const [blogContent, setBlogContent] = useState("");
  const [saveText, setSaveText] = useState("");
  const [draftId, setDraftId] = useState(null);
  const [showPublish, setShowPublish] = useState(false);
  const { blogId } = useParams();
  const [disblePublish, setDisablePublish] = useState(true);

  var formats = [
    "header",
    "height",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "color",
    "bullet",
    "indent",
    "link",
    "image",
    "align",
    "size",
  ];

  var modules = {
    toolbar: [
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      [{ indent: "-1" }, { indent: "+1" }],
    ],
  };

  const userInfo = JSON.parse(localStorage.getItem('userAuth')) || {};

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      quillRef.current.focus();
    }
  };

  const handleTitleChange = (e) => {
    setBlogTitle(e.target.value);
  };

  const handleBlogContentChange = (content) => {
    setBlogContent(content);
  };

  const handlePublish = async () => {
    const payload = {
      title: blogTitle,
      content: blogContent,
      author: "Simran",
      status: "published"
    };
    await axiosInstance
      .post("/api/blog/create", payload)
      .then((res) => {
        console.log("response is", res);
      })
      .catch((err) => {
        console.log("error is", err);
      });
  };

  const handleClick = async () => {
    console.log("helo jdjk");
    await axiosInstance
      .get("/api/blog/getAllBlogs")
      .then((res) => {
        console.log("response is", res);
      })
      .catch((err) => {
        console.log("error is", err);
      });
  };

  const saveDraftBlog = async () => {
    const payload = {
      title: blogTitle,
      content: blogContent,
      author: userInfo.userName,
      authorId: userInfo.user_id,
      status: "drafts",
      draftId: blogId || draftId,
      createdOn: new Date(),
    };
    await axiosInstance.post("/api/blog/saveDraft", payload).then((res) => {
      if(res && res.data && res.data.draftId){
        setDraftId(res.data.draftId);
        setDisablePublish(false);
      }
    }).catch((err) => {
      console.log("error is", err)
    })
  }

  const deleteDraft = async () => {
    const payload = {
      title: blogTitle,
      content: blogContent,
      author: userInfo.userName,
      authorId: userInfo.user_id,
      status: "drafts",
      draftId
    };
    await axiosInstance.post("/api/blog/deleteDraft", payload).then((res) => {
      // if(res && res.data && res.data.draftId){
      //   setDraftId(res.data.draftId);
      // }
    }).catch((err) => {
      console.log("error is", err)
    })
  }

  const getHtmlContent = (html) => {
    const strippedContent = html.replace(/<[^>]*>?/gm, '').trim();
    return strippedContent.length > 0;  // Check if there's any content left
  };

  const getContentToRender = (showPublish, data) => {
    setShowPublish(showPublish);
    if(data){
      setBlogTitle(data.draft.title);
      setBlogContent(data.draft.content)
    }
  }

  const getDraftById = async () => {
    await axiosInstance.get("/api/blog/getBlog", {
        params: {
            id: blogId
          },
    }).then((res) => {
       getContentToRender(false, res.data);
      }).catch((err) => {
        console.log("error is", err)
      })
  }

  useEffect(() => {
    if(titleRef.current){
      titleRef.current.focus()
    }
    if(blogId){
      getDraftById();
    }
  },[])

  useEffect(() => {
    setSaveText("")
    if (getHtmlContent(blogContent)) {
     
      const savingTimer = setTimeout(() => {
        setSaveText('Saving...');
      }, 1000); 

      const savedTimer = setTimeout(() => {
        setSaveText('Saved');
        saveDraftBlog();
      }, 2000); 

      return () => {
        clearTimeout(savingTimer);
        clearTimeout(savedTimer);
      };
    }
    else{
      if(draftId){
        deleteDraft();
      }
    }
  }, [blogContent, blogTitle]);

  return (
    <>
    {showPublish ? 
      <PublishStory getContentToRender={getContentToRender} draftId={draftId} draftTitle={blogTitle} draftContent = {blogContent} />
      : <div className="editor-contr">
      <Navbar page="newStory" isDisabled={disblePublish} blogTitle={blogTitle} blogContent={blogContent} getHtmlContent={getHtmlContent} getContentToRender = {getContentToRender} />
      <div className="inner-contr">
        <div className="text-editor">
          <div style={{display:"flex"}}>
            <CiCirclePlus style={{fontSize:"45px", color:"#e5ddd", borderRight:"1px solid #dbdbdb", paddingRight:'5px', marginRight:'7px', height:'66px', color: '#d7d7d7'}}/>
            <div style={{display:"flex", flexDirection:"column"}}>
              <span className="draft-text">Draft in <span>{userInfo.userName}</span><span className="save-text">{saveText}</span></span>
              <input
                ref={titleRef}
                placeholder="Title"
                value={blogTitle}
                className="title"
                onKeyDown={handleKeyPress}
                onChange={(e) => handleTitleChange(e)}
              ></input>
            </div>
          </div>



          <ReactQuill
            value={blogContent.length > 0 ? blogContent : null}
            theme="snow"
            ref={quillRef}
            modules={modules}
            formats={formats}
            placeholder="Tell your story ..."
            onChange={handleBlogContentChange}
          ></ReactQuill>
        </div>
        {/* <button onClick={() => handlePublish()}>Publish</button>
        <button onClick={() => handleClick()}>Schedule for later</button> */}
        {/* <DateTime /> */}
      </div>
    </div>}
    </>

  );
};

export default Editor;
