const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const Project = require('../models/Project');

/**
 * POST /api/projects  (with room image upload)
 */
const createProject = async (req, res, next) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: 'Room image is required.' });
    }

    const originalImage = `/uploads/${req.file.filename}`;

    // Generate thumbnail using sharp
    const thumbFilename = `thumb-${req.file.filename}`;
    const thumbPath = path.join(__dirname, '../../uploads', thumbFilename);
    await sharp(req.file.path)
      .resize(300, 200, { fit: 'cover' })
      .toFile(thumbPath);

    const project = await Project.create({
      user: req.user._id,
      name: req.body.name || 'Untitled Project',
      originalImage,
      thumbnail: `/uploads/${thumbFilename}`,
      wallSelections: req.body.wallSelections
        ? JSON.parse(req.body.wallSelections)
        : [],
      isPublic: req.body.isPublic === 'true' || req.body.isPublic === true,
    });

    res.status(201).json({
      success: true,
      message: 'Project created successfully.',
      data: { project },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/projects  (current user's projects, paginated)
 */
const getUserProjects = async (req, res, next) => {
  try {
    const { page = 1, limit = 12, sort = '-updatedAt' } = req.query;
    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    const [projects, total] = await Promise.all([
      Project.find({ user: req.user._id })
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit, 10))
        .populate('wallSelections.colorId', 'name hex')
        .populate('wallSelections.patternId', 'name imageUrl'),
      Project.countDocuments({ user: req.user._id }),
    ]);

    res.json({
      success: true,
      data: {
        projects,
        pagination: {
          total,
          page: parseInt(page, 10),
          limit: parseInt(limit, 10),
          pages: Math.ceil(total / parseInt(limit, 10)),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/projects/:id  (verify ownership)
 */
const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('wallSelections.colorId')
      .populate('wallSelections.patternId')
      .populate('user', 'name email');

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: 'Project not found.' });
    }

    // Allow owner or admin
    if (
      project.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin' &&
      !project.isPublic
    ) {
      return res
        .status(403)
        .json({ success: false, message: 'Access denied.' });
    }

    res.json({ success: true, data: { project } });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/projects/:id
 */
const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: 'Project not found.' });
    }
    if (project.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: 'Access denied.' });
    }

    const allowedFields = ['name', 'wallSelections', 'isPublic'];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        project[field] = req.body[field];
      }
    });

    await project.save();

    res.json({
      success: true,
      message: 'Project updated successfully.',
      data: { project },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/projects/:id/design  — save painted image (base64 → file)
 */
const saveDesign = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: 'Project not found.' });
    }
    if (project.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: 'Access denied.' });
    }

    const { imageData } = req.body;
    if (!imageData) {
      return res
        .status(400)
        .json({ success: false, message: 'Image data is required.' });
    }

    // Strip the data URI prefix if present
    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    const filename = `design-${project._id}-${Date.now()}.png`;
    const filepath = path.join(__dirname, '../../uploads', filename);

    await sharp(buffer).png().toFile(filepath);

    project.paintedImage = `/uploads/${filename}`;
    await project.save();

    res.json({
      success: true,
      message: 'Design saved successfully.',
      data: { paintedImage: project.paintedImage },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/projects/:id
 */
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: 'Project not found.' });
    }
    if (project.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: 'Access denied.' });
    }

    // Clean up uploaded files
    const filesToRemove = [
      project.originalImage,
      project.paintedImage,
      project.thumbnail,
    ].filter(Boolean);

    for (const filePath of filesToRemove) {
      const absPath = path.join(__dirname, '../..', filePath);
      if (fs.existsSync(absPath)) {
        fs.unlinkSync(absPath);
      }
    }

    await Project.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Project deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/projects/public  (gallery / inspiration)
 */
const getPublicProjects = async (req, res, next) => {
  try {
    const { page = 1, limit = 12 } = req.query;
    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    const [projects, total] = await Promise.all([
      Project.find({ isPublic: true })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit, 10))
        .populate('user', 'name avatar')
        .populate('wallSelections.colorId', 'name hex'),
      Project.countDocuments({ isPublic: true }),
    ]);

    res.json({
      success: true,
      data: {
        projects,
        pagination: {
          total,
          page: parseInt(page, 10),
          limit: parseInt(limit, 10),
          pages: Math.ceil(total / parseInt(limit, 10)),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProject,
  getUserProjects,
  getProjectById,
  updateProject,
  saveDesign,
  deleteProject,
  getPublicProjects,
};
