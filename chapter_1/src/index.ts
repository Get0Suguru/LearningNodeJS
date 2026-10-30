import express, { type Request, type Response } from "express";

// here we practice against express

const app = express();
const port = 8080;

// middleware config to express -> to resolve the req.body object as json
app.use(express.json());
/**
 * This tells Express: "Hey, if someone sends me JSON data in a POST request, please parse it and put it inside req.body."
 */

const dummyData: object[] = [
  {
    name: "John Doe",
    age: 30,
    city: "New York",
  },
];

// console.log("hello world");

// ### WEBSITE ENDPOINTS ------------------------------------------

// endpoint 1 -> home
// httpVerb(endpoint, req-res-callback)
app.get("/", (req: Request, res: Response) => {
  res.status(200).send(`<!DOCTYPE html>
<html>
<body style="color: red; background: black;">
  <h1>hello, its home</h1>
  <a href="/dashboard">dashboard</a>
  <br><br>

  <input id="nameInput" placeholder="add user name">
  <br>
  <input id="ageInput" placeholder="age">
  <br>
  <input id="cityInput" placeholder="city">
  <br>
  <button id="submitBtn">submit in dummydb</button>

  <script type="text/javascript">
    // @ts-ignore
    document.getElementById("submitBtn").addEventListener("click", async () => {
      const name = document.getElementById("nameInput").value;
      const age = document.getElementById("ageInput").value;
      const city = document.getElementById("cityInput").value;

      const userD = { name, age, city };

      try {
        const response = await fetch('/api/user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userD)
        });
        const data = await response.json();
        console.log(data);
        alert("User added successfully!");
      } catch (err) {
        console.log(err);
      }
    });
  </script>
</body>
</html>`);
});

// endpoint 2 -> Dashboard
app.get("/dashboard", (req: Request, res: Response) => {
  console.log("hello from dashboard: method used -" + req.method);
  res.status(202).send(`<body> 
    <h1>hello, its dashboard</h1>
    <br>
    <a href="/">home</a>
    <br>
    <h3>dummy data of users</h3>
    <pre> that's how u show tamplet string in html <br><br> ${JSON.stringify(dummyData)}</pre>
    </body>`);
});

// ### API ENDPOINTS ------------------------------------------

// endpoint 3 -> post to dummydb
app.post("/api/user", (req: Request, res: Response) => {
  const newUser = req.body;
  console.log("received new userData, user:" + JSON.stringify(newUser));
  res.status(201).json({
    message: "user created",
    user: newUser,
  });
  dummyData.push(newUser);
});

// endpoint 4 -> delete from dummydb
app.delete("/api/user", (req: Request, res: Response) => {
  console.log("received delete request");
  const deletedUser = dummyData.pop();
  res.status(200).json({
    message: "user deleted",
    user: deletedUser,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port} but who cares `);
});
