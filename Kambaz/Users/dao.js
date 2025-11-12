import { v4 as uuidv4 } from "uuid";
export default function UsersDao(db) {
  // FIX: keep reference to the real array (don’t destructure & reassign)
  const users = db.users;

  // FIX: mutate in place + return created user
  const createUser = (user) => {
    const newUser = { ...user, _id: uuidv4() };
    users.push(newUser);
    return newUser;
  };

  const findUserByUsername = (username) =>
    users.find((user) => user.username === username);

  // FIX: merge updates, preserve _id, return updated user
  const updateUser = (userId, user) => {
    const idx = users.findIndex((u) => u._id === userId);
    if (idx < 0) return null;
    users[idx] = { ...users[idx], ...user, _id: userId };
    return users[idx];
  };

  const findAllUsers = () => users;
  const findUserById = (userId) => users.find((user) => user._id === userId);
  const findUserByCredentials = (username, password) =>
    users.find((user) => user.username === username && user.password === password);

  // FIX: mutate in place, return boolean
  const deleteUser = (userId) => {
    const idx = users.findIndex((u) => u._id === userId);
    if (idx < 0) return false;
    users.splice(idx, 1);
    return true;
  };

  return {
    createUser,
    findAllUsers,
    findUserById,
    findUserByUsername,
    findUserByCredentials,
    updateUser,
    deleteUser,
  };
}
