const Banner = require('../models/Banner');

// @desc    Get all banners
// @route   GET /api/banners
exports.getBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ order: 1, id: -1 });
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách banner', error: error.message });
  }
};

// @desc    Get 3 latest banners for homepage
// @route   GET /api/banners/latest
exports.getLatestBanners = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 3;
    const banners = await Banner.find().sort({ id: -1 }).limit(limit);
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server khi lấy 3 banner mới nhất', error: error.message });
  }
};

// @desc    Get single banner by id or slug
// @route   GET /api/banners/:idOrSlug
exports.getBannerByIdOrSlug = async (req, res) => {
  try {
    const { id: idOrSlug } = req.params;
    let banner;

    if (!isNaN(idOrSlug)) {
      banner = await Banner.findOne({ id: Number(idOrSlug) });
    }
    if (!banner) {
      banner = await Banner.findOne({ slug: idOrSlug });
    }
    if (!banner && idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      banner = await Banner.findById(idOrSlug);
    }

    if (!banner) {
      return res.status(404).json({ message: 'Không tìm thấy banner' });
    }
    res.json(banner);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server khi lấy chi tiết banner', error: error.message });
  }
};
