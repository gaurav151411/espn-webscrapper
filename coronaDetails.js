const request=require("request");

const cheerio=require("cheerio");
request("https://www.worldometers.info/coronavirus/",cb);

// cb stands for callback function

function cb(err,res,body){
    if(err){
        console.log("error",err);
    }
    else{
        handleHtml(body);
    }
}


function handleHtml(html){
    let selecTool=cheerio.load(html);

    let coronaStatsArr=selecTool(".maincounter-number");

    let totalCases =selecTool(coronaStatsArr[0]).text();
    console.log("Total Cases ->"+ totalCases);

    let totalDeaths=selecTool(coronaStatsArr[1]).text();
    console.log("Total Deaths ->"+ totalDeaths);

    let totalRecovered=selecTool(coronaStatsArr[2]).text();
    console.log("Total Recovered ->"+ totalRecovered);

}