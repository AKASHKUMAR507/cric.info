const url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595";

const request = require("request");
const fs = require("fs");
const path = require("path");
// const xlsx = require("xlsx");
const cheerio = require("cheerio");
const AllMatchObj = require("./AllMatch");
// home page
const iplPath = path.join(__dirname,"ipl");
dirCreater(iplPath);
request(url, cb);

function cb(err, response, html) {
    if (err) {
        console.log(err);
    } else {
        extractLink(html);
        // console.log(html);
    }
}

function extractLink(html) {
    let $ = cheerio.load(html);
    let anchoElem = $("a[data-hover='View All Results']");
    let link = anchoElem.attr("href");
    // console.log(link);
    let fullLink = "https://www.espncricinfo.com/" + link;
    // console.log(fullLink);
    // getAllMachesLink(fullLink);
    AllMatchObj.getAllMatch(fullLink);
}

function dirCreater(filePath){
    if(fs.existsSync(filePath) == false){
        fs.mkdirSync(filePath);
    }
}




