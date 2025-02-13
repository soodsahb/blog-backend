
import Post from '../models/Post.js';


export const getAllPosts = async (req, res) => {
    try {
      const posts = await Post.find()
        .populate('author', 'username email')
        .populate('likes', 'username')
        .populate('comments.author', 'username')
        .sort({ createdAt: -1 });
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


  export const getPost = async (req, res) => {
    try {
      const post = await Post.findById(req.params.id)
        .populate('author', 'username email')
        .populate('likes', 'username')
        .populate('comments.author', 'username');
      
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  


export const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const post = await Post.create({
      title,
      content,
      author: req.user.userId 
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const updatePost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    
    if (post.author.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to update this post' });
    }

    post.title = title;
    post.content = content;
    await post.save();

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    
    if (post.author.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await post.deleteOne();
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleLike = async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      const userId = req.user.userId;
      const isLiked = post.likes.includes(userId);
  
      if (isLiked) {
        
        post.likes = post.likes.filter(id => id.toString() !== userId);
      } else {
        
        post.likes.push(userId);
      }
  
      await post.save();
      res.json({ 
        message: isLiked ? 'Post unliked' : 'Post liked',
        likes: post.likes.length
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  
  export const addComment = async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      const newComment = {
        content: req.body.content,
        author: req.user.userId
      };
  
      post.comments.push(newComment);
      await post.save();
  
      
      const populatedPost = await Post.findById(post._id)
        .populate('comments.author', 'username');
  
      const addedComment = populatedPost.comments[populatedPost.comments.length - 1];
  
      res.status(201).json(addedComment);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  
  export const deleteComment = async (req, res) => {
    try {
      const post = await Post.findById(req.params.postId);
      
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      const comment = post.comments.id(req.params.commentId);
      
      if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
      }
  
      
      if (comment.author.toString() !== req.user.userId) {
        return res.status(403).json({ message: 'Not authorized to delete this comment' });
      }
  
      comment.deleteOne();
      await post.save();
  
      res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };