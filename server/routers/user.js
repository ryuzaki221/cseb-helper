const { Router } = require("express");
const User = require("../models/user");
const auth = require("../middleware/auth");
const router = new Router();

router.post("/signup", async (req, res) => {
  try {
    const user = new User(req.body);
    const token = user.generateAuthToken();
    await user.save();
    res.send({ token });
  } catch (e) {
    console.log(e);
    res.sendStatus(400);
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = user.generateAuthToken();
    res.send(token);
  } catch (e) {
    console.log(e);
    res.sendStatus(400);
  }
});

router.get("/me", auth, (req, res) => {
  try {
    res.send(req.user);
  } catch (e) {
    console.log(e);
    res.sendStatus(400);
  }
});

router.get("/all-households", auth, async (req, res) => {
  try {
    await req.user.populate("households").execPopulate();
    res.send(req.user.households);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});
module.exports = router;
