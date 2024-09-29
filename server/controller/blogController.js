import Blog from "../model/blog.js";

export const createBlog = async (req, res) => {
    const { title, content, author, status } = req.body;

    try{
        const blogData = req.body;
        const newBlog = blogData && new Blog({
            title, 
            content,
            author,
            status
        });
        await newBlog.save();
        res.status(200).json({message: "Blog is successfully created", status: "SUCCESS"})
    }catch(err){
        console.log(err);
        res.status(500).json({message: "Not able to publish the blog", status: "FAIL"})
    }
}

export const getAllBlogs = async (req, res) => {
    const {authorId, selfBlog } = req.body;
    let result = [];
    try{
        let allBlogs = await Blog.find();
        // allBlogs = allBlogs.filter((item) => {
        //     return item?.status === 'published'; 
        // })

        if(selfBlog){
             result = allBlogs.filter((ele) => {
                return ele.authorId === authorId;
            })
        }
        else{
             result = allBlogs.filter((ele) => {
                return ele.authorId !== authorId;
            })
        }
        res.status(200).json({message: "Get all the user blogs", status: "SUCCESS", allBlogs: result})
    }catch(err){
        console.log(err);
        res.status(500).json({ message: 'Not able to fetch blogs' });
    }
}

export const getBlogById = async (req,res) => {
    const blogId = req.query.id;
    try{
        const draft = await Blog.findById(blogId);
        if(draft){
            return res.status(200).json({ message: 'Draft found with the given ID', draft });
        }
        else{
            return res.status(404).json({ message: 'No draft found'});
        }
    }
    catch(err){
        res.status(500).json({message: "Not able to find the draft", status: "FAIL"})
    }
}

export const saveDraft = async (req,res) => {
    const {title, content, author, status, draftId, createdOn, authorId} = req.body;
    try{
        if(draftId){
            let draft = await Blog.findById(draftId);
    
            if (draft) {
                draft.title = title;
                draft.content = content;
                //   draft.updatedAt = Date.now();
                await draft.save();
                return res.status(200).json({ message: 'Draft updated successfully', draftId: draft._id });
            } 
            else {
                return res.status(404).json({ message: 'Draft not found' });
            }
        }
        else{
            const draftData = req.body;
            const newDraft = draftData && new Blog({
                title, 
                content,
                author,
                status,
                createdOn,
                authorId
            });
            await newDraft.save();
            res.status(200).json({message: "Draft is successfully saved", draftId: newDraft._id, status: "SUCCESS"})
        }
    }catch(err){
        console.log(err);
        res.status(500).json({message: "Not able to save the draft", status: "FAIL"})
    }
}


export const deleteDraft = async (req, res) => {
    const {draftId} = req.body;
    try{
        if (draftId) {
            const updatedBlogList = await Blog.findByIdAndDelete(draftId);
            return res.status(200).json({ message: 'Draft deleted successfully.', deletedId: updatedBlogList._id });
          } else {
            return res.status(400).json({ message: 'No draft found to delete.' });
          }
        
    }catch(err){
        res.status(500).json({message: "Not able to delete draft"})
    }
}

export const publishBlog = async(req, res) => {
    try {
        const blogId = req.params.id;
        const {storyTags, bannerImage} = req.body;
    
        const blog = await Blog.findById(blogId);

        if(blog){
            blog.status = "published",
            blog.publishedOn = new Date();
            blog.bannerImage = bannerImage,
            blog.tags= storyTags;
        }
        await blog.save();
        res.status(200).json({
        message: 'Blog published successfully',
        });
    } catch (error) {
        res.status(500).json({ message: 'Error publishing the blog', error });
    }
}

export const likeBlog = async (req, res) => {
    const {blogId, user_id, like} = req.body;
    try {
    
        const blog = await Blog.findById(blogId);
    
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        if(like){
            blog.clapCount = blog.clapCount + 1;
            blog.clapsBy.push(user_id);
        }
        else{
            blog.clapCount = blog.clapCount - 1;
            blog.clapsBy = blog.clapsBy.filter((item) => item!=user_id)
        }

        await blog.save();

        res.status(200).json({ message: "Likes for blogs updated"});
        } catch (error) {
            res.status(500).json({ message: 'Server Error' });
        }
    }

    export const bookmarkBlog = async (req, res) => {
        const {blogId, user_id, bookmark} = req.body;
        try {
        
            const blog = await Blog.findById(blogId);
        
            if (!blog) {
                return res.status(404).json({ message: 'Blog not found' });
            }
    
            if(bookmark){
                blog.savedBy.push(user_id);
            }
            else{
                blog.savedBy = blog.savedBy.filter((item) => item!=user_id)
            }
    
            await blog.save();
    
            res.status(200).json({ message: "Saved blogs updated"});
            } catch (error) {
                res.status(500).json({ message: 'Server Error' });
            }
        }

    export const addNotes = async(req, res) => {
        try {
            const blogId = req.params.id;
            const { blogNotes } = req.body;
        
            const blog = await Blog.findById(blogId);

            if(blog){
                blog.notes = blogNotes
            }
            await blog.save();
            res.status(200).json({ message: 'Blog updated successfully'});
        } catch (error) {
            res.status(500).json({ message: 'Error updating the blog', error });
        }
    }
  
    export const scheduleBlog = async (req, res) => {
        const { id } = req.params;
        const { scheduledPublishDate } = req.body;
      
        try {
          const blog = await Blog.findById(id);
          console.log("blog is", blog)
      
          if (!blog) {
            return res.status(404).send({ message: 'Blog not found' });
          }
      
          blog.status = 'scheduled';
          blog.scheduledFor = scheduledPublishDate;
      
          await blog.save();
      
          res.status(200).send({ message: 'Blog scheduled successfully', blog });
        } catch (error) {
          res.status(500).send({ message: 'Error scheduling blog', error });
        }
      };


    export const searchBlog = async (req, res) => {
        const {searchQuery} = req.body;
        try {
          const allBlogs = await Blog.find();

          const searchBlog = allBlogs.filter((item) => {
            return item?.tags?.includes(searchQuery)
          })
          if (searchBlog) {
            return res.status(200).send({ message: 'Blog found for the tag', blogs: searchBlog });
          }
          else{
            return res.status(200).send({ message: 'No blog found'});
          }
        } catch (error) {
          res.status(500).send({ message: 'Error finding blog', error });
        }

      }