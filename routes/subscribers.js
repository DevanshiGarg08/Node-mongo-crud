const express = require("express");
const router = express.Router();
const Subscriber = require("../models/subscriberModel");
//get all
router.get("/", async (req, res) => {
  try {
    const subscribers = await Subscriber.find();
    res.send(subscribers);
  } catch (error) {
    res.status(500).send({ message: error.message }); //Server error
  }
});

//get one
router.get("/:id", getSubscriber, (req, res) => {
  res.send(res.subscriber);
});

//create one
router.post("/", async (req, res) => {
  const subscriber = new Subscriber({
    name: req.body.name,
  });
  try {
    const newSubscriber = await subscriber.save();
    res.status(201).json(newSubscriber); //Success
  } catch (error) {
    res.status(400).json({ message: error.message }); //Client error
  }
});

//update one
router.patch("/:id", getSubscriber, async (req, res) => {
  if (req.body.name != null) {
    res.subscriber.name = req.body.name;
  }
  if (req.body.subscribeDate != null) {
    res.subscriber.subscribeDate = req.body.subscribeDate;
  }
  try {
    const updatedSubscriber = await res.subscriber.save();
    res.status(201).json(updatedSubscriber); //Success
  } catch (error) {
    res.status(400).json({ message: error.message }); //Client error
  }
});

//delete one
router.delete("/:id", getSubscriber, async (req, res) => {
  try {
    await res.subscriber.remove();
    res.json({ message: "Subscriber deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message }); //Server error
  }
});

//middleware
async function getSubscriber(req, res, next) {
  let subscriber;
  try {
    subscriber = await Subscriber.findById(req.params.id);
    if (subscriber == null)
      return res.status(404).json({ message: "Subscriber not found" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  res.subscriber = subscriber;
  next();
}

module.exports = router;
