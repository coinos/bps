import fastify from "fastify";
import bpo from "bpo";

let app = fastify();

app.post("/proxy", async ({ body: { method, params } }, res) => {
  try {
    let whitelist = [
      "echo",
      "estimatesmartfee",
      "getblock",
      "getblockhash",
      "getblockchaininfo",
      "getnetworkinfo",
    ];

    if (!whitelist.includes(method)) throw new Error("unsupported method");

    if (method === "estimatesmartfee" || method === "getblockhash")
      params[0] = parseInt(params[0]);

    if (method === "getblock") params[1] = parseInt(params[1]);

    res.send(await bpo({})[method](...params));
  } catch (e) {
    res.code(500).send(e.message);
  }
});

let host = process.env.HOST || "0.0.0.0";
let port = process.env.PORT || 8080;

app.listen({ host, port });
