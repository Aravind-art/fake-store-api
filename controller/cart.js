const Cart = require("../model/cart");
const jwt = require("jsonwebtoken");
const User = require("../model/user");

module.exports.getAllCarts = (req, res) => {
  const limit = Number(req.query.limit) || 0;
  const sort = req.query.sort == "desc" ? -1 : 1;
  const startDate = req.query.startdate || new Date("1970-1-1");
  const endDate = req.query.enddate || new Date();

  Cart.find({
    date: { $gte: new Date(startDate), $lt: new Date(endDate) },
  })
    .select("-_id -products._id")
    .limit(limit)
    .sort({ id: sort })
    .then((carts) => {
      res.json(carts);
    })
    .catch((err) => console.log(err));
};

module.exports.getCartsbyUserid = async (req, res) => {
  const userId = req.userData._id;
  const startDate = req.query.startdate || new Date("1970-1-1");
  const endDate = req.query.enddate || new Date();
  Cart.find({ userId })
    .select("-_id -products._id -userId")
    .then((carts) => {
      res.json(carts);
    })
    .catch((err) => console.log(err));
};

module.exports.getSingleCart = async (req, res) => {
  const userId = req.userData._id;
  const cart = await Cart.aggregate()
    .lookup({
      from: "products",
      localField: "products.productId",
      foreignField: "id",
      as: "lineItems",
    })
    .match({ userId })
    .project({
      __v: 0,
      _id: 0,
      "products._id": 0,
      "lineItems._id": 0,
      "lineItems.__v": 0,
    })
    .catch((err) => console.log(err));

  res.json(cart);
};

module.exports.addCart = async (req, res) => {
  const userId = req.userData._id;
  const date = req.query.date || new Date();

  if (typeof req.body == undefined) {
    res.status(400).json({
      status: "error",
      message: "data is undefined",
    });
  } else {
    let cartCount = 0;
    Cart.find({
      userId,
    })
      .then((carts) => {
        const cart = {
          id: carts.length + 1,
          userId: userId,
          date: date,
          products: req.body.products || [],
        };
        if (carts.length > 0) {
          res.json([...carts].pop());
          return;
        }
        const cartInstance = new Cart(cart);
        cartInstance
          .save()
          .then((cart) => {
            res.json(cart);
          })
          .catch((err) => res.status(400).json(err));
      })
      .catch((err) => console.log(err));
  }
  // res.json({ ...req.body, id: Cart.find().count() + 1 });
};

module.exports.editCart = async (req, res) => {
  const userId = req.userData._id;
  if (typeof req.body == undefined) {
    res.status(400).json({
      status: "error",
      message: "something went wrong! check your sent data",
    });
  } else {
    Cart.findOneAndUpdate(
      { userId },
      { products: req.body.products },
      { new: true }
    )

      .then((cart) => {
        res.json(cart);
      })
      .catch((err) => res.status(400).json(err));
  }
};

module.exports.deleteCart = async (req, res) => {
  const userId = req.userData._id;
  Cart.findOneAndDelete({ userId }).then(() => {
    res.json("Cart Deleted!");
  });
};
