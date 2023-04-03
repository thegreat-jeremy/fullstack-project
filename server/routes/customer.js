const express = require("express");
const router = express.Router();
const mysql = require("../mysql");

router.get("/", async (req, res) => {
  const customers = await mysql.query("customerList");
  res.send(customers);
});

router.get("/:id", async (req, res) => {
  const customers = await mysql.query("customerDetail", req.params.id);
  res.send(customers[0]);
});

router.put("/:id", async (req, res) => {
  const r = await mysql.query("customerUpdate", [
    req.body.param,
    req.params.id,
  ]);
  res.send(r);
});

// 조회-post
router.post("/search", async (req, res) => {
  const where = req.body.where;
  const customers = await mysql.query("customerListByCondition", {}, where);
  res.send(customers);
});

router.delete("/:id", async (req, res) => {
  const r = await mysql.query("customerDelete", req.params.id);
  res.send(r);
});

router.post("/", async (req, res) => {
  const r = await mysql.query("customerInsert", req.body.param);
  res.send(r);
});

module.exports = router;
