const {
  assignmentFeed,
  assignmentDetails,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  submitAssignment,
} = require("../controllers/assignment-controller");
const { validateAssignmentCreation } = require("../middleware/assignment");

module.exports = (app, auth) => {
  app.post("/assignments", auth, assignmentFeed);
  app.get("/assignment/:id", auth, assignmentDetails);

  app.post("/assignment", auth, validateAssignmentCreation, createAssignment);
  app.put("/assignment/:id", auth, updateAssignment);
  app.delete("/assignment/:id", auth, deleteAssignment);

  app.post("/assignment/:id", auth, submitAssignment);
};
