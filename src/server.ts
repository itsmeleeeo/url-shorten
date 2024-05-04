import fastify from "fastify";
import { z } from 'zod'
import { sql } from "./lib/postgres";

const app = fastify();

app.get("/", () => {
    return "Hello World"
})

app.post("/links", async (req, res) => {
    const createLinkSchema = z.object({
        code: z.string().min(3),
        url: z.string().url(),
    })

    const { code, url} = createLinkSchema.parse(req.body);

    const result = await sql`INSERT INTO urlShorten(code, original_url) VALUES(${code}, ${url}) RETURNING id`
    const link = result[0]

    return res.status(201).send({ shortLinkId: link.id});
});

app.listen({
    port: 3333
}).then(() => {
    console.log(`server running on port 3333`);
});