import cron from 'node-cron';
import Blog from "./model/blog.js";
import moment from 'moment';

const formattedDate = (date) => {
    return  moment(date).format('DD MMMM YYYY'); // Example: "19 September 2024"
}

// Schedule a cron job to check for scheduled blogs every minute
export const scheduleBlogPublishing = () => {
cron.schedule('* * * * *', async () => {
  let now = new Date();
  now = formattedDate(now);

  try {
    // Find blogs that are scheduled to be published and the time has passed
    const blogsToPublish = await Blog.find({
      status: 'scheduled',
      scheduledFor: { $lte: now }
    });

    blogsToPublish.forEach(async (blog) => {
      blog.status = 'published';
      blog.publishedDate = formattedDate(new Date());
      await blog.save();
    });
    
  } catch (error) {
  }
})
}
