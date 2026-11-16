import { validateIdParams, validatePhoto } from "../middleware/validation.js";
import Photo from "../models/Photo.js";
import Comment from "../models/Comment.js";
import path from "node:path";
import { unlink } from "node:fs/promises";

const removeImageFile = async (imageName) => {
  try {
    await unlink(path.join("uploads", path.basename(imageName)));
  } catch (problem) {
    if (problem.code !== "ENOENT") {
      throw problem;
    }
  }
};

export const getAll = async (request, response) => {
  try {
    const photoRecords = await Photo.find().sort({ dateTime: -1 });
    return response.status(200).json({ message: "success get all", photos: photoRecords });
  } catch (problem) {
    return response.status(500).json("failed to get all photos");
  }
};

export const getOne = async (request, response) => {
  const { error: problem, value: checkedData } = validateIdParams(request.params);
  if (problem) {
    return response.status(400).json({
      message: problem.details[0].message,
    });
  }
  try {
    const matchedPhoto = await Photo.findById(checkedData.id)
      .populate("userId", "firstName lastName");
    if (!matchedPhoto) {
      return response.status(404).json("failed to find photo");
    }
    const commentRecords = await Comment.find({ photoId: checkedData.id })
      .populate("userId", "firstName lastName")
      .sort({ dateTime: 1 });
    return response.status(200).json({ message: "success getOne", foundPhoto: matchedPhoto, comments: commentRecords });
  }

catch (problem) {
    return response.status(500).json("database error");
  }
};

export const create = async (request, response) => {
  try {
    const { error: problem, value: checkedData } = validatePhoto(request.body);
    if (problem) {
      if (request.file) {
        await removeImageFile(request.file.filename);
      }
      return response.status(400).json({ message: problem.details[0].message });
    }

    if (!request.file) {
      return response.status(400).json({ message: "Please upload a photo" });
    }

    const createdPhoto = new Photo({
      title: checkedData.title,
      description: checkedData.description,
      fileName: request.file.filename,
      userId: request.session.userId,
    });

    await createdPhoto.save();
    return response.status(201).json({
      message: "Photo created successfully",
      photo: createdPhoto,
    });
  }
  catch (problem) {
    if (request.file) {
      await removeImageFile(request.file.filename);
    }
    return response.status(500).json({ message: "Failed to create photo" });
  }
};

export const remove = async (request, response) => {
  const { error: problem, value: checkedData } = validateIdParams(request.params);
  if (problem) {
    return response.status(400).json({ message: problem.details[0].message });
  }

  try {
    const matchedPhoto = await Photo.findById(checkedData.id);
    if (!matchedPhoto) {
      return response.status(404).json({ message: "Photo not found" });
    }

    if (matchedPhoto.userId.toString() !== request.session.userId) {
      return response.status(403).json({ message: "You can only delete your own photos" });
    }

    await removeImageFile(matchedPhoto.fileName);
    await Comment.deleteMany({ photoId: matchedPhoto._id });
    await matchedPhoto.deleteOne();
    return response.status(200).json({ message: "Photo deleted successfully" });
  } catch (problem) {
    return response.status(500).json({ message: "Failed to delete photo" });
  }
};
