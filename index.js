const fs = require('fs');
const http = require('http');
const url = require('url');

// ////////////////////////////////////////
//Files

// const text = fs.readFileSync('./txt/input.txt', 'utf8');
// console.log(text);
//
// const textOut = `This is what we know about the avocado:  ${text}. \nCreated on ${Date.now()}`
// fs.writeFileSync('./txt/output.txt', textOut);
// console.log('File written!');

// ////////////////////////////////////////
//Server

const replaceTemplate = (temp, product)=> {
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%ID%}/g, product.id);

    if(!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');

    return output;
}


const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf8');


const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf8');
const dataObj=JSON.parse(data);

const server = http.createServer((req, res) => {

    const{query, pathname} = url.parse(req.url, true)
    //  PRODUCT PAGE
    if (pathname === '/product') {
        res.writeHead(200, {'Content-type': 'text/html'});
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product);
        res.end(output)


    //  OVERVIEW PAGE
    } else if (pathname === '/' || pathname === '/overview') {
        res.writeHead(200, {'Content-type': 'text/html'});

        const cardsHtml = dataObj.map((el)=> replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
        res.end(output)

    //  API
    } else if (pathname === '/api') {
        res.writeHead(200, {'Content-type': 'application/json'});
        res.end(data);

    //  NOT FOUND PAGE
    } else {
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'hello-world',
            'My-test': 'This is my test'
        })
        res.end('<h1>This page not found</h1>')
    }
})

server.listen(8000, '127.0.0.1', () => {
    console.log('Server started on port 8000');
})