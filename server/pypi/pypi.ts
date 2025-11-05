import { Hono } from "hono";
import { basePath } from "hono/route";
import { cache } from "hono/cache";
import urlJoin from "url-join";

export const pypi = new Hono();

const pycache = cache({ cacheName: "pypi" });

pypi.get("packages/*", pycache, async (c) =>
  fetch(`https://files.pythonhosted.org${c.req.path.replace(basePath(c), "")}`)
);

pypi.get("simple/", pycache, async (c) => {
  const res = await fetch(`https://pypi.org/simple/`);

  return new HTMLRewriter()
    .on("a", {
      element(element) {
        let href = element.getAttribute("href") ?? "";
        if (!href) return;
        element.setAttribute("href", href.replace("/simple", ""));
      },
    })
    .transform(res);
});

pypi.get("simple/:module/", pycache, async (c) => {
  const module = c.req.param("module");
  const res = await fetch(`https://pypi.org/simple/${module}/`);

  const replaceFrom = "https://files.pythonhosted.org/packages/";
  const replaceTo = urlJoin(
    new URL(c.req.url).origin,
    basePath(c),
    "packages/"
  );

  return new HTMLRewriter()
    .on("a", {
      element(element) {
        let href = element.getAttribute("href") ?? "";
        if (!href) return;
        element.setAttribute("href", href.replace(replaceFrom, replaceTo));
      },
    })
    .transform(res);
});
