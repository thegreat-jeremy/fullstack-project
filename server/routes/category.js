const express = require("express");
const router = express.Router();
const mysql = require("../mysql");

router.get("/", async (req, res) => {
  const categoryList = await mysql.query("categoryList");
  res.send(categoryList);
});

// 조회-post
router.post("/search", async (req, res) => {
  const where = req.body.where;
  const categoryList = await mysql.query("categoryListByCondition", {}, where);
  res.send(categoryList);
});

router.get("/:product_category_id", async (req, res) => {
  const product_category_id = req.params.product_category_id;
  const categoryList = await mysql.query("categoryDetail", product_category_id);
  res.send(categoryList);
  // res.send(categoryList[0]);
});

router.post("/", async (req, res) => {
  const result = await mysql.query("categoryInsert", req.body.param);
  res.send(result);
});

router.put("/:product_category_id", async (req, res) => {
  const product_category_id = req.params.product_category_id;
  const result = await mysql.query("categoryUpdate", [
    req.body.param,
    product_category_id,
  ]);

  res.send(result);
});

router.delete("/:product_category_id", async (req, res) => {
  const product_category_id = req.params.product_category_id;

  const count = await mysql.query("productCount", product_category_id);

  if (count[0].count === 0) {
    const result = await mysql.query("categoryDelete", product_category_id);
    res.send(result);
  } else {
    res.send({ status: 501, count: count[0] });
  }
});

module.exports = router;
