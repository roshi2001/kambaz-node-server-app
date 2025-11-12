import UsersDao from "./dao.js";
export default function UserRoutes(app, db) {
  const dao = UsersDao(db);

  const createUser = (req, res) => {
    try {
      const user = dao.createUser(req.body);
      res.status(201).json(user);
    } catch (e) {
      res.status(400).json({ message: e.message || "Unable to create user" });
    }
  };

  const deleteUser = (req, res) => {
    try {
      const { userId } = req.params;
      const ok = dao.deleteUser(userId);
      if (!ok) return res.status(404).json({ message: "User not found" });
      res.sendStatus(204);
    } catch (e) {
      res.status(400).json({ message: e.message || "Unable to delete user" });
    }
  };

  const findAllUsers = (req, res) => {
    try {
      const users = dao.findAllUsers();
      res.json(users);
    } catch (e) {
      res.status(400).json({ message: e.message || "Unable to fetch users" });
    }
  };

  const findUserById = (req, res) => {
    try {
      const { userId } = req.params;
      const user = dao.findUserById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json(user);
    } catch (e) {
      res.status(400).json({ message: e.message || "Unable to fetch user" });
    }
  };

  const updateUser = (req, res) => {
    const userId = req.params.userId;
    const userUpdates = req.body;
    dao.updateUser(userId, userUpdates);
    const currentUser = dao.findUserById(userId);
    req.session["currentUser"] = currentUser;
    res.json(currentUser);
  };

  const signup = (req, res) => {
    const user = dao.findUserByUsername(req.body.username);
    if (user) {
      res.status(400).json({ message: "Username already in use" });
      return;
    }
    const currentUser = dao.createUser(req.body);
    req.session["currentUser"] = currentUser;
    res.json(currentUser);
  };

  const signin = (req, res) => {
    const { username, password } = req.body;
    const currentUser = dao.findUserByCredentials(username, password);
    if (currentUser) {
      req.session["currentUser"] = currentUser;
      res.json(currentUser);
    } else {
      res.status(401).json({ message: "Unable to login. Try again later." });
    }
  };
  app.post("/api/users/signin", signin);

  const signout = (req, res) => {
    req.session.destroy();
    res.sendStatus(200);
  };

  
  const profile = (req, res) => {
    const sessionUser = req.session["currentUser"];
    if (!sessionUser) {
      res.sendStatus(401);
      return;
    }
    const freshUser = dao.findUserById(sessionUser._id);
    if (!freshUser) {
      res.sendStatus(401);
      return;
    }
    res.json(freshUser);
  };

  app.post("/api/users", createUser);
  app.get("/api/users", findAllUsers);
  app.get("/api/users/:userId", findUserById);
  app.put("/api/users/:userId", updateUser);
  app.delete("/api/users/:userId", deleteUser);
  app.post("/api/users/signup", signup);
  app.post("/api/users/signout", signout);
  app.post("/api/users/profile", profile);
}
