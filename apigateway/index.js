const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');


// const accountServiceProxy = proxy([
//     '/api/a-users',
//     '/api/a-search',
//     '/login',
//     '/logout',
//     '/authenticate',
// ], {
//     target: 'http://localhost:2222',
// });
const bookProxy = createProxyMiddleware(

    '/book'

    , {
        target: 'http://localhost:3000/',
    });

const customerProxy = createProxyMiddleware(
    '/customer'
    , {
        target: 'http://localhost:4000',
    })

const orderProxy = createProxyMiddleware(
    '/order'
    , {
        target: 'http://localhost:5000',
    });



const app = express();
const PORT = 8000;

app.use(bookProxy);
app.use(customerProxy);
app.use(orderProxy);

app.listen(PORT, () => { console.log(`API Gateway is running on port ${PORT}`) })



