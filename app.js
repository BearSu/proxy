const http = require('http');
const https = require('https');
const httpProxy = require('http-proxy');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

let interval;
(
  function onStart() 
  {
    let proxy;
    let proxyServer;

    const url = 'https://script.google.com/macros/s/AKfycbwjddQYPb5og8Vnb8cLmC-cso3sIOuNK7wQrSIemcwiOTdRQ87p8KFPKCR_eaHOlx_w7g/exec';
    fetch(url, { "method": "GET", })
    .then((response) => response.json())
    .then
    (
      (proxyConfig) => 
      {
        let { serviceUrl } = proxyConfig;
        
        let listenPort = process.env.PORT || 3000;
        let onListen = () => console.log(`proxy server is running ${listenPort}`);
        let proxyWeb =
        {
          changeOrigin: true,
          target:
          {
            port: 443,
            protocol: 'https:',
            host: serviceUrl,
            // host: '23eb-60-246-55-192.ngrok-free.app',
          },
        }
        let proxyTo = (req, res) => { proxy.web(req, res, proxyWeb) };

        proxy = httpProxy.createProxyServer();
        proxyServer = http.createServer(proxyTo);
        proxyServer.listen(listenPort, onListen);
        console.log(proxyServer.address());
      }
    )
  }
)();
