const assignment = {
  id: 1,
  title: "NodeJS Assignment",
  description: "Create a NodeJS server with ExpressJS",
  due: "2021-10-10",
  completed: false,
  score: 0,
};

const moduleObj = {
  id: "m101",
  name: "Intro to Node & Express",
  description: "Basics of building APIs with Express",
  course: "CS5610",
};

export default function WorkingWithObjects(app) {
 
  app.get("/lab5/assignment", (req, res) => res.json(assignment));
   app.get("/lab5/assignment/title", (req, res) => {
    const { newTitle } = req.query;
    if (newTitle) assignment.title = newTitle;
    res.json({ title: assignment.title });
  });

  app.get("/lab5/assignment/title/:newTitle", (req, res) => {
    assignment.title = req.params.newTitle;
    res.json({ title: assignment.title });
  });

  app.get("/lab5/module", (req, res) => {
    res.json(moduleObj);
  });

  app.get("/lab5/module/name", (req, res) => {
    res.json({ name: moduleObj.name });
  });

  app.get("/lab5/module/name/:newName", (req, res) => {
    moduleObj.name = req.params.newName;
    res.json({ name: moduleObj.name });
  });

  app.get("/lab5/module/description/:newDesc", (req, res) => {
    moduleObj.description = req.params.newDesc;
    res.json({ description: moduleObj.description });
  });
  app.get("/lab5/assignment/score/:score", (req, res) => {
    const score = Number(req.params.score);
    if (Number.isNaN(score)) return res.status(400).json({ error: "score must be a number" });
    assignment.score = score;
    res.json({ score: assignment.score });
  });
  app.get("/lab5/assignment/completed/:value", (req, res) => {
    const v = String(req.params.value).toLowerCase();
    assignment.completed = v === "true" || v === "1" || v === "yes" || v === "on";
    res.json({ completed: assignment.completed });
  });
}
