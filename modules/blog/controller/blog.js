import blogModle from "../../../DB/models/Blog.model.js";
import userModle from "../../../DB/models/User.model.js";
import cloudinary from "./../../../services/cloudinary.js";

export const addBlog = async (req, res) => {
  const { title, description } = req.body;
  try {
    const blog = new blogModle({
      title,
      description,
      createdBy: req.authUser._id,
    });
    const saveBlog = await blog.save();
    res.status(200).json({ message: "Done", saveBlog });
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
};
export const addBlogPic = async (req, res) => {
  try {
    if (!req.files) {
      res.json({ message: "please upload images" });
    } else {
      const urls = [];
      for (const file of req.files) {
        const { secure_url } = await cloudinary.uploader.upload(file.path, {
          folder: `blog/pictures`,
        });
        urls.push(secure_url);
      }
      await blogModle.updateMany({ pictures: urls });
      res.status(200).json({ message: "Done", urls });
    }
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
};
export const likeBlog = async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await blogModle
      .findOneAndUpdate(
        { _id: id, likes: { $nin: req.authUser._id } },
        {
          $push: { likes: req.authUser._id },
          $pull: { unlikes: req.authUser._id },
        }, {new : true}
      )
      .select("likes unlikes");
    if (!blog) {
      res.status(400).json({ message: "In-valid blog id or user may be like this blog" });
    } else {
      await blogModle.updateOne(
        { _id: id },
        { totalCount: Math.abs(blog.likes.length - blog.unlikes.length) }
      );
      res.status(200).json({mesage : 'Done'})
    }
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
};
export const unlikeBlog = async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await blogModle
      .findOneAndUpdate(
        { _id: id, unlikes: { $nin: req.authUser._id } },
        {
          $push: { unlikes: req.authUser._id },
          $pull: { likes: req.authUser._id },
        }, {new : true}
      )
      .select("likes unlikes");
    if (!blog) {
      res.status(400).json({ message: "In-valid blog id or user may be unlike this blog" });
    } else {
      console.log(Math.abs(blog.likes.length - blog.unlikes.length));
      await blogModle.updateOne(
        { _id: id },
        { totalCount: Math.abs(blog.likes.length - blog.unlikes.length) }
      );
      res.status(200).json({mesage : 'Done'})
    }
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
};
export const getAllBlogs = async(req, res)=>{
  try {
    const blogs = await blogModle.find({createdBy : {$nin : null}}).populate([{
      path : 'createdBy',
      select : '-password',
      match : {isDeleted : false}
    }, {
      path : 'likes',
      select : '-password',
      match : {isDeleted : false}
    }, {
      path : 'unlikes',
      select : '-password',
      match : {isDeleted : false}
    }])
    if (!blogs.length) {
      res.status(400).json({message : 'users not found'})
    } else {
      res.status(200).json({message : 'Done', blogs})
    }
  } catch (error) {
    res.status(500).json({message : 'catch error', error})
  }
}
export const addVideo = async(req, res)=>{
  try {
    if (!req.file) {
      res.status(400).json({message : 'please upload your video'})
    } else {
      const {secure_url} = await cloudinary.uploader.upload(req.file.path, {
        folder : 'blog/video', resource_type: "video"})
      console.log(secure_url);
      const blog = await blogModle.updateMany({video : secure_url})
      if (!blog.modifiedCount) {
        res.status(400).json({message : 'In-valid Blogs'})
      } else {
        res.status(200).json({message : 'Done', secure_url})
      }
    }
  } catch (error) {
    res.status(500).json({message : 'catch error', error})
  }
}
