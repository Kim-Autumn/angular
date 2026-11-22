const Blog = require('../models/Blog');

// @desc    Get all blogs
// @route   GET /api/blogs
exports.getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ id: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách bài viết', error: error.message });
  }
};

// @desc    Get single blog by id or slug
// @route   GET /api/blogs/:idOrSlug
exports.getBlogByIdOrSlug = async (req, res) => {
  try {
    const { id: idOrSlug } = req.params;
    let blog;

    if (!isNaN(idOrSlug)) {
      blog = await Blog.findOne({ id: Number(idOrSlug) });
    }
    if (!blog) {
      blog = await Blog.findOne({ slug: idOrSlug });
    }
    if (!blog && idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      blog = await Blog.findById(idOrSlug);
    }

    if (!blog) {
      return res.status(404).json({ message: 'Không tìm thấy bài viết' });
    }
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server khi lấy chi tiết bài viết', error: error.message });
  }
};
