export async function onRequest(context) {
  const url = new URL(context.request.url);

  if (url.hostname === "darwinhernandez.com") {
    url.hostname = "www.darwinhernandez.com";
    return Response.redirect(url.toString(), 301);
  }

  return context.next();
}
