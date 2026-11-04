import express from "express";
import db from "../db.js";
import prisma from "../prismaClient.js";


const router = express.Router();

// endpoint 1 (get all todos)
router.get("/", async (req, res) => {
  const todos = await prisma.todo.findMany({
    where: {
      userId: (req as any).userId
    }
  });
  res.status(200).json(todos);
})


// endpoint 3 (add todo)
router.post("/", async (req, res) => {
  const { task } = req.body;
  if(!task) {
    return res.status(400).json({ message: "Task is required" });
  }
  const newTodo = await prisma.todo.create({
    data: {
      task,
      userId: (req as any).userId
    }
  });
  res.status(201).json(newTodo);
});

// endpoint 4 (update todo by id)
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { task, completed} = req.body;

  const updatedTodo = await prisma.todo.update({
    where: {
      id: parseInt(id),
      userId: (req as any).userId
    },
    data: {
      task,
      completed
    }
  });
  
  if (!updatedTodo) {
    return res.status(404).json({ message: "Todo not found" });
  }
  res.status(200).json({ message: "Todo updated successfully" });
});

// endpoint 5 (delete todo by id)
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const deletedTodo = await prisma.todo.delete({
    where: {
      id: parseInt(id),
      userId: (req as any).userId
    }
  });
  if (!deletedTodo) {
    return res.status(404).json({ message: "Todo not found" });
  } else {
    res.status(200).json({ message: "Todo deleted successfully" });
  }
})

export default router;