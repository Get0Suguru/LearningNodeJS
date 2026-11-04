import express from "express";
import db from "../db.js";


const router = express.Router();

// endpoint 1 (get all todos)
router.get("/", (req, res) => {
  const statement = db.prepare(
    `SELECT * FROM todos WHERE user_id = ?`
  )
  const todos = statement.all((req as any).userId)
  res.status(200).json(todos);
})


// endpoint 3 (add todo)
router.post("/", (req, res) => {
  const { task } = req.body;
  if(!task) {
    return res.status(400).json({ message: "Task is required" });
  }
  const statement = db.prepare(
    `INSERT INTO todos (task, user_id) VALUES (?, ?)`
  );
  statement.run(task, (req as any).userId);
  res.status(201).json({ message: "Todo added successfully" });
});

// endpoint 4 (update todo by id)
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { task, completed} = req.body;

  
  const statement = db.prepare(
    `UPDATE todos SET task = ?, completed = ? WHERE id = ? AND user_id = ?`
  );
  const result = statement.run(task, completed, id, (req as any).userId);
  if (result.changes === 0) {
    return res.status(404).json({ message: "Todo not found" });
  }
  res.status(200).json({ message: "Todo updated successfully" });
});

// endpoint 5 (delete todo by id)
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const statement = db.prepare(
    `DELETE FROM todos WHERE id = ? AND user_id = ?`
  );
  const result = statement.run(id, (req as any).userId);  
  if (result.changes === 0) {
    return res.status(404).json({ message: "Todo not found" });
  } else {
    res.status(200).json({ message: "Todo deleted successfully" });
  }
})

export default router;