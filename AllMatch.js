const request = require("request");
const cheerio = require("cheerio");
const scoreCardObj = require("./scorecard")

function getAllMachesLink(url) {
    request(url, function (err, response, html){
        if (err) {
            console.log(err);
        } else {
            extractAllLinks(html);
            // console.log(html);
        }
    });
}

function extractAllLinks(html){
    let $ = cheerio.load(html);
    let scorecardElem = $("a[data-hover='Scorecard']");
    for(let i = 0; i<scorecardElem.length;i++){
        let link = $(scorecardElem[i]).attr("href");
        // console.log(link);
        let fullLink = "https://www.espncricinfo.com/" + link;
        console.log(fullLink);
        scoreCardObj.ps(fullLink);

    }
}


module.exports = {
    getAllMatch: getAllMachesLink
}
