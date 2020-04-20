module.exports = (req, res, next) => {
  if (req.session.loggedIn) {
    console.log("session", req.session);

    next();
  } else {
    res.status(401).json({ message: "you shall not pass" });
  }
};
