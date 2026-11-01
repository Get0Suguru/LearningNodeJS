import express from "express"
import path from "path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


const app = express()
const port = process.env.PORT || 3000

//middleware for server static files
app.use(express.static(path.join(__dirname, "../public")))

// start server to listen requests on port
app.listen(port, () => {
  console.log(`listening on port ${port}`)
})

// temp endpoint to serve html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

console.log("up and runnin")

