let url="https://www.espncricinfo.com/series/ipl-2020-21-1210595";
const fs=require("fs");
const path=require("path");
const request=require("request");
const cheerio=require("cheerio");



const allMatchObj=require("./allMatch");


request(url,cb); // cb stands for callback function

function cb(err,res,body){
    if(err){
        console.log("error",err);
    }
    else{
        handleHtml(body);
    }
}    
let iplPath=path.join(__dirname,"IPL");
// _dirname function gives the path current
if(!fs.existsSync(iplPath)){
    fs.mkdirSync(iplPath);
}

function handleHtml(html){
    let selecTool=cheerio.load(html);
    let anchorElem =selecTool('a[data-hover="View All Results"]');
    // console.log(anchorElem);

    //attr method-> it s method for getting values corresponding to attribute object
    let relativeLink=anchorElem.attr("href");

    let fullLink="https://www.espncricinfo.com"+ relativeLink;
    
    // console.log(fullLink);
    allMatchObj.getAllMatch(fullLink);
    //now call passed to getAllMatch(fullLink) in allMatch.js
};