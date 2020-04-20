const router = require("express").Router();
const bcrypt = require("bcryptjs");

const Users = require("../users/users-model.js");

router.post("/register", (req, res) => {
  const creds = req.body;
  // rounds are 2 to the N times
  const rounds = process.env.HASH_ROUNDS || 16;

  // hash the creds.password

  creds.password = bcrypt.hashSync(creds.password, rounds);
  // update the creds

  Users.add(creds)
    .then((saved) => {
      res.status(201).json(saved);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ errorMessage: error.message });
    });
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  // search for the user by usernamethe
  Users.findBy({ username })
    .then((user) => {
      console.log(user);
      // if we find the user, then also check that passwords match
      if (user && bcrypt.compareSync(password, user[0].password)) {
        req.session.loggedIn = true;
        res.status(200).json({ message: `Welcome, ${user[0].username}!` });
      } else {
        res.status(401).json({ message: "You cannot pass" });
      }
      res.status(201).json(user);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ errorMessage: error.message });
    });
});

module.exports = router;
