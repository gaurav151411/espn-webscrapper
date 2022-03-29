const cheerio=require("cheerio");

let html=`
`

//cheerio stores data in the form of objects
let selecTool=cheerio.load(html);

let fruitNameArr=selecTool("");
console.log();



