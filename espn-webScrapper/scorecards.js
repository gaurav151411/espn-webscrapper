const request=require("request");
const cheerio=require("cheerio");
const fs=require("fs");
const path=require("path");
const xlsx=require("xlsx");

//visit every scoreCard and get Info
function getInfoFromScorecard(url){
   //we have the value of the scorecard ,we need to get the html of that scorecard
   request(url,cb);
}

function cb(err,res,body){
    if(err){
        console.log(err);
    }
    else{
        getMatchDetails(body);
    }
}

function getMatchDetails(html){
    // selecTool will contain the html of the ith scorecard
    let selecTool=cheerio.load(html);
 
    //1.get venue
    //2.get date
    let desc=selecTool(".match-header-info.match-info-MATCH");
    let descArr=desc.text().split(",");
     //Match (N), Abu Dhabi, Oct 25 2020, Indian Premier League

    // ->descArr
    /*[
        'resultFinal (N)',
        ' Dubai (DSC)',
        ' Nov 10 2020',
        ' Indian Premier League'
    ]*/

    let dateOfMatch=descArr[2];

    let venueOfMatch=descArr[1];
    
    console.log("Match held on:"+dateOfMatch);
    console.log("Match held at:"+venueOfMatch);

    //3. get result
    let matchResEle=selecTool(".match-info.match-info-MATCH.match-info-MATCH-half-width>.status-text");
    let matchResult=matchResEle.text();

    // 4.get team names
    let teamNames=selecTool(".name-detail>.name-link");
    let ownTeam=selecTool(teamNames[0]).text();
    let opponentTeam=selecTool(teamNames[1]).text();
    console.log(ownTeam);
    console.log(opponentTeam);

    // 5.get innings

    let allBatsmenTable=selecTool(".table.batsman tbody");
    // console.log(allBatsmenRows.text());
   let htmlContents="";

    for(let i=0;i<allBatsmenTable.length;i++){
        htmlContents+=selecTool(allBatsmenTable[i]).html();

        //get the descendants(table rows) of each elemnet(table)
        let allRows=selecTool(allBatsmenTable[i]).find("tr");
        // let temp ;
        if (i == 1) {
            let temp = ownTeam;
            ownTeam = opponentTeam;
            opponentTeam = temp;
        }
        console.log(ownTeam);
        console.log(opponentTeam);

        for(let i=0;i<allRows.length;i++){
            // checking to see if any matched elements have the given classname ,to avoid spaces
            let row=selecTool(allRows[i]);
            let firstColumnOfRow=row.find("td")[0];
            if(selecTool(firstColumnOfRow).hasClass("batsman-cell")){
                // name | runs |balls |4's|6's|sr

                let pn = selecTool(row.find("td")[0]).text().split("");
                // console.log(pn);
                // console.log(pn.join(""));

                let playerName = "";
                //Determines whether an array includes a certain element, returning true or false as appropriate.
                if (pn.includes("(")) {
                playerName = pn.join("").split("(")[0];
                // console.log(playerName);
                } else if (pn.includes("†")) {
                playerName = pn.join("").split("†")[0];
                // console.log(playerName);
                } else playerName = pn.join("");
                //playerName = "hello"; //†


                let runs=selecTool(row.find("td")[2]).text();

                let  balls_faced=selecTool(row.find("td")[3]).text();

                let fours=selecTool(row.find("td")[5]).text();

                let sixes=selecTool(row.find("td")[6]).text();

                let strike_rate=selecTool(row.find("td")[7]).text();

                // console.log(`${playerName} | ${runs} |  ${balls_faced}  |   ${fours}  |  ${sixes}   |   ${strike_rate}`)

                processInformation(
                    dateOfMatch,
                    venueOfMatch,
                    matchResult,
                    ownTeam,
                    opponentTeam,
                    playerName,
                    runs,
                    balls_faced,
                    fours,
                    sixes,
                    strike_rate
                );
                console.log("-------------------------------------------------------");

            }
        }
      
    }
}

function processInformation( dateOfMatch,venueOfMatch, matchResult, team1,team2,playerName,runs,balls_faced,fours,sixes,strike_rate){
    let teamNamePath=path.join(__dirname,"IPL",team1);
    if(!fs.existsSync(teamNamePath)){
        fs.mkdirSync(teamNamePath);
    }
  

    let playerPath=path.join(teamNamePath,playerName+".xlsx");
    let content=excelReader(playerPath,playerName);

    let playerObj={
        dateOfMatch,
        venueOfMatch,
        matchResult,
        team1,
        team2,
        playerName,
        runs,
        balls_faced,
        fours,
        sixes,
        strike_rate
    };

    content.push(playerObj);

    
    //this function writes all the content into excel sheet , and places that excel sheet data into playerPath-> eg.rohitSharma.xlsx
    excelWriter(playerPath,content,playerName);
}

function excelReader(playerPath,sheetName){
    if(!fs.existsSync(playerPath)){
        return [];
        // content =[]   
    }
      //if playerPath already has some data in it
     let workBook=xlsx.readFile(playerPath);
       //A dictionary of the worksheets in the workbook. Use SheetNames to reference these.

       let excelData=workBook.Sheets[sheetName];

       let playerObj=xlsx.utils.sheet_to_json(excelData);

       return playerObj;

}

function excelWriter(playerPath,jsObject,sheetName){
    // to create  a new workbook
    let newWorkBook=xlsx.utils.book_new();

    // to convert an array of js objects to a worksheet
    let newWorkSheet=xlsx.utils.json_to_sheet(jsObject);

    // to append worksheet to a workbook
    xlsx.utils.book_append_sheet(newWorkBook,newWorkSheet,sheetName);

    // attempting to write or download workbook data to file
    xlsx.writeFile(newWorkBook,playerPath);

}


module.exports={
    gifs:getInfoFromScorecard,
}