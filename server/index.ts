import { Hono } from "hono";

import { pypi } from "./pypi/pypi";

export const index = new Hono();

index.route("/pypi", pypi);

export default index;
