const request=require("request");
const cheerio=require("cheerio");

const{gifs}=require("./scorecards");
//const getobj=require("./scorecards");

function getAllMatch(url){
    request(url,cb);
} // cb stands for callback function

function cb(err,res,body){
    if(err){
        console.log("error",err);
    }
    else{
        extractAllMatchLink(body);
    }
}

function extractAllMatchLink(html){
    let selecTool=cheerio.load(html);
    let scorecardElemArr=selecTool('[data-hover="Scorecard"]');
    // console.log(scorecardElemArr.length);

    for (let i=0;i<scorecardElemArr.length;i++){
        let scorecardLink=selecTool(scorecardElemArr[i]).attr("href");
        console.log(scorecardLink);

        let fullLink="https://www.espncricinfo.com"+ scorecardLink;

        gifs(fullLink);
        //or getobj.gifs(fullLink);
    }
}

module.exports={
    getAllMatch:getAllMatch,
};

