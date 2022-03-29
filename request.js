const request=require("request");

request("https://www.worldometers.info/coronavirus/");

function cb(err,res,body){
    console.log("error",err);

    console.log(body);

}