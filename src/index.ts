import { Hono } from "hono"
import { repeatRoute } from "./routes/repeat"

const app = new Hono()

app.route("/", repeatRoute)

export default app
