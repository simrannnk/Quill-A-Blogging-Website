import mongoose from "mongoose";

const blogSchema = mongoose.Schema({

    title: {
        type: String,
        required: function() {
            return this.status === 'published';
        }
    },
    content: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true
    },
    authorId: {
        type: String,
    },
    status: {
        type: String,
        enum: ['drafts', 'published', 'scheduled'],
        default: 'draft'
    },
    publishedOn: {
        type: Date
    },
    createdOn: {
        type: Date
    },
    clapCount: {
        type: Number,
        default: 0
    },
    clapsBy: {
        type: Array,
        default: []
    },
    tags: {
        type: Array,
        default: []
    },
    bannerImage: {
        type: String
    },
    savedBy: {
        type: Array,
        default: []
    },
    notes: {
        type: String,
        default: ""
    },
    scheduledFor: {
        type: String
    }

}, {timestamps: true})

const Blog = mongoose.model('blog', blogSchema)
export default Blog;