import { validateIdParams, validateComment } from "../middleware/validation.js";
import Comment from "../models/Comment.js";
import Photo from "../models/Photo.js";

export const create = async (request, response) => {
  const { error: parameterError } = validateIdParams(request.params);
  if (parameterError) {
    return response.status(400).json({ message: parameterError.details[0].message });
  }

  const { error: problem, value: checkedData } = validateComment(request.body);
  if (problem) {
    return response.status(400).json({ message: problem.details[0].message });
  }

  try {
    const matchedPhoto = await Photo.findById(request.params.id);
    if (!matchedPhoto) {
      return response.status(404).json({ message: "Photo not found" });
    }

    const createdComment = new Comment({
      photoId: matchedPhoto._id,
      userId: request.session.userId,
      comment: checkedData.comment,
    });

    await createdComment.save();
    await createdComment.populate("userId", "firstName lastName");
    return response.status(201).json({
      message: "Comment created successfully",
      comment: createdComment,
    });
  } catch (problem) {
    return response.status(500).json({ message: "Failed to create comment" });
  }
};
