import { Hono } from "hono"
import { repeatRoute } from "./routes/repeat"

const app = new Hono()

app.route("/repeat", repeatRoute)

export default app
