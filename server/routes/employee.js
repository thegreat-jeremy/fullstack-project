const express = require("express");
const router = express.Router();
const mysql = require("../mysql");

router.get("/", async (req, res) => {
  const employeeList = await mysql.query("employeeList");
  res.send(employeeList);
});

router.get("/name", async (req, res) => {
  const name = req.query.name;
  const employeeList = await mysql.query("employeeListByName", `%${name}%`);
  res.send(employeeList);
});

// 조회-post
router.post("/search", async (req, res) => {
  const where = req.body.where;
  const employeeList = await mysql.query("employeeListByCondition", {}, where);
  res.send(employeeList);
});

router.get("/:employee_id", async (req, res) => {
  const employee_id = req.params.employee_id;
  const employeeList = await mysql.query("employeeDetail", employee_id);
  res.send(employeeList);
});

router.post("/", async (req, res) => {
  const result = await mysql.query("employeeInsert", req.body.param);
  res.send(result);
});

router.put("/:employee_id", async (req, res) => {
  const employee_id = req.params.employee_id;
  const result = await mysql.query("employeeUpdate", [
    req.body.param,
    employee_id,
  ]);

  res.send(result);
});

router.delete("/:employee_id", async (req, res) => {
  const employee_id = req.params.employee_id;

  const result = await mysql.query("employeeUpdate", [
    { active_yn: "N" },
    employee_id,
  ]);

  res.send(result);
});

module.exports = router;
