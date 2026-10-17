const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const types={".html":"text/html; charset=utf-8",".svg":"image/svg+xml",".webmanifest":"application/manifest+json",".js":"text/javascript; charset=utf-8"};
const files=new Set(["/","/index.html","/icon.svg","/cover-art.svg","/manifest.webmanifest","/sw.js"]);
http.createServer((req,res)=>{
 const pathname=new URL(req.url,"http://localhost").pathname;
 if(pathname==="/health"){res.writeHead(200,{"Content-Type":"text/plain"});return res.end("ok")}
 if(!["GET","HEAD"].includes(req.method)||!files.has(pathname)){res.writeHead(404);return res.end("Not found")}
 const file=path.join(__dirname,pathname==="/"?"index.html":pathname.slice(1));
 fs.readFile(file,(err,buf)=>{if(err){res.writeHead(404);return res.end("Not found")};res.writeHead(200,{"Content-Type":types[path.extname(file)]||"application/octet-stream","X-Content-Type-Options":"nosniff","Referrer-Policy":"no-referrer","Cache-Control":pathname==="/sw.js"?"no-cache":"public, max-age=300"});if(req.method==="HEAD")return res.end();res.end(buf)});
}).listen(Number(process.env.PORT||3000),"0.0.0.0");
