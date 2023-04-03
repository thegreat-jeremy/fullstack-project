const express = require("express");
const router = express.Router();
const mysql = require("../mysql");

router.get("/", async (req, res) => {
  const productList = await mysql.query("productList");
  res.send(productList);
});

router.get("/searchByName", async (req, res) => {
  const productList = await mysql.query(
    "productListByName",
    `%${req.query.name}%`
  );
  res.send(productList);
});

router.get("/:product_id", async (req, res) => {
  const product_id = req.params.product_id;
  const productList = await mysql.query("productDetail", product_id);
  res.send(productList[0]);
});

// 조회-post
router.post("/search", async (req, res) => {
  const where = req.body.where;
  const productList = await mysql.query("productListByCondition", {}, where);
  res.send(productList);
});

router.post("/", async (req, res) => {
  const result = await mysql.query("productInsert", req.body.param);
  res.send(result);
});

router.put("/:product_id", async (req, res) => {
  const product_id = req.params.product_id;
  const result = await mysql.query("productUpdate", [
    req.body.param,
    product_id,
  ]);

  res.send(result);
});

router.delete("/:product_id", async (req, res) => {
  const product_id = req.params.product_id;

  const count = await mysql.query("orderCountByProduct", product_id);

  if (count[0].count === 0) {
    const result = await mysql.query("productDelete", product_id);
    res.send(result);
  } else {
    res.send({ status: 501, count: count[0] });
  }
});

module.exports = router;
