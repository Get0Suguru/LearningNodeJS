import express from "express"
import path from "path"
import { fileURLToPath } from "node:url"
import authRoutes from "./routes/authRoutes.js"
import todoRoutes from "./routes/todoRoutes.js"
import jwtAuthMiddleware from "./middleware/authMiddleware.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


const app = express()
const port = process.env.PORT || 3000

//middleware 1-> for server static files
app.use(express.static(path.join(__dirname, "../public")))
// middleware 2 -> for parsing application/json sent in post/put request by client
app.use(express.json())   
// middleware 3 -> for handeling routing 
app.use("/auth", authRoutes)   
app.use("/todos", jwtAuthMiddleware, todoRoutes)

// start server to listen requests on port
app.listen(port, () => {
  console.log(`listening on port ${port}`)
})

// temp endpoint to serve html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

console.log("up and runnin")

