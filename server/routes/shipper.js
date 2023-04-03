const express = require("express");
const router = express.Router();
const mysql = require("../mysql");

router.get("/", async (req, res) => {
  const shipperList = await mysql.query("shipperList");
  res.send(shipperList);
});

// 조회-post
router.post("/search", async (req, res) => {
  const where = req.body.where;
  const shipperList = await mysql.query("shipperListByCondition", {}, where);
  res.send(shipperList);
});

router.get("/:shipper_id", async (req, res) => {
  const shipper_id = req.params.shipper_id;
  const shipperList = await mysql.query("shipperDetail", shipper_id);
  res.send(shipperList);
});

router.post("/", async (req, res) => {
  const result = await mysql.query("shipperInsert", req.body.param);
  res.send(result);
});

router.put("/:shipper_id", async (req, res) => {
  const shipper_id = req.params.shipper_id;
  const result = await mysql.query("shipperUpdate", [
    req.body.param,
    shipper_id,
  ]);

  res.send(result);
});

router.delete("/:shipper_id", async (req, res) => {
  const shipper_id = req.params.shipper_id;

  const count = await mysql.query("orderCount", shipper_id);

  if (count[0].count === 0) {
    const result = await mysql.query("shipperDelete", shipper_id);
    res.send(result);
  } else {
    res.send({ status: 501, count: count[0] });
  }
});

module.exports = router;
