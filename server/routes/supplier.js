const express = require("express");
const router = express.Router();
const mysql = require("../mysql");

router.get("/", async (req, res) => {
  const supplierList = await mysql.query("supplierList");
  res.send(supplierList);
});

// 조회-post
router.post("/search", async (req, res) => {
  const where = req.body.where;
  const supplierList = await mysql.query("supplierListByCondition", {}, where);
  res.send(supplierList);
});

router.get("/:supplier_id", async (req, res) => {
  const supplier_id = req.params.supplier_id;
  const supplierList = await mysql.query("supplierDetail", supplier_id);
  res.send(supplierList[0]);
});

router.post("/", async (req, res) => {
  const result = await mysql.query("supplierInsert", req.body.param);
  res.send(result);
});

router.put("/:supplier_id", async (req, res) => {
  const supplier_id = req.params.supplier_id;
  const result = await mysql.query("supplierUpdate", [
    req.body.param,
    supplier_id,
  ]);

  res.send(result);
});

router.delete("/:supplier_id", async (req, res) => {
  const supplier_id = req.params.supplier_id;

  const count = await mysql.query("productCountBySupplier", supplier_id);

  if (count[0].count === 0) {
    const result = await mysql.query("supplierDelete", supplier_id);
    res.send(result);
  } else {
    res.send({ status: 501, count: count[0] });
  }
});

module.exports = router;
