const express = require("express");
const router = express.Router();
const mysql = require("../mysql");

router.get("/", async (req, res) => {
  const customers = await mysql.query("customerList2");
  res.send(customers);
});

router.get("/:id", async (req, res) => {
  const customers = await mysql.query("customerDetail2", req.params.id);
  res.send(customers[0]);
});

router.put("/:id", async (req, res) => {
  const r = await mysql.query("customerUpdate2", [
    req.body.param,
    req.params.id,
  ]);
  res.send(r);
});

// 조회-post
router.post("/search", async (req, res) => {
  const where = req.body.where;
  const customers = await mysql.query("customerListByCondition2", {}, where);
  res.send(customers);
});

router.delete("/:customer_id", async (req, res) => {
  const customer_id = req.params.customer_id;

  const count = await mysql.query("orderCount", customer_id);

  if (count[0].count === 0) {
    const result = await mysql.query("customerDelete2", customer_id);
    res.send(result);
  } else {
    res.send({ status: 501, count: count[0] });
  }
});

router.post("/", async (req, res) => {
  const r = await mysql.query("customerInsert2", req.body.param);
  res.send(r);
});

module.exports = router;
