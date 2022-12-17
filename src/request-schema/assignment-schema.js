const JoiBase = require("joi");
const Joi = JoiBase.extend(require("@joi/date"));

const createAssignmentSchema = Joi.object({
  description: Joi.string().max(200).optional(),
  publishDate: Joi.date().format("YYYY-MM-DD").raw().required(),
  deadlineDate: Joi.date().format("YYYY-MM-DD").raw().required(),
  studentList: Joi.array().items(Joi.number().integer().min(1).required()),
});

module.exports = {
  createAssignmentSchema,
};
