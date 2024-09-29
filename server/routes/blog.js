import express from 'express';
import { createBlog, getAllBlogs, saveDraft, deleteDraft, getBlogById, scheduleBlog, publishBlog, likeBlog, bookmarkBlog, addNotes, searchBlog} from '../controller/blogController.js';

const blogRouter = express.Router();

blogRouter.post('/create', createBlog);
blogRouter.post('/getAllBlogs', getAllBlogs);
blogRouter.post('/saveDraft', saveDraft)
blogRouter.post('/deleteDraft', deleteDraft)
blogRouter.get('/getBlog', getBlogById)
blogRouter.post('/:id/publish', publishBlog)
blogRouter.post('/likeBlog', likeBlog);
blogRouter.post('/bookmark', bookmarkBlog);
blogRouter.post('/:id/add-notes', addNotes);
blogRouter.put('/:id/schedule', scheduleBlog)
blogRouter.post('/search', searchBlog)

export default blogRouter; 