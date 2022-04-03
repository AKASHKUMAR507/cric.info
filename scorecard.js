// const url = "https://www.espncricinfo.com//series/ipl-2020-21-1210595/mumbai-indians-vs-chennai-super-kings-1st-match-1216492/full-scorecard";


const request = require("request");
const cheerio = require("cheerio");
const path = require("path");
const fs = require("fs");
const xlsx = require("xlsx")

function processScorecard(url) {
    request(url, cb);
}


function cb(err, response, html) {
    if (err) {
        console.log(err);
    } else {
        // console.log(html);
        extractMatchDetails(html);
    }
}


function extractMatchDetails(html) {
    // Venue date opponent runs balls fours sixes sr 
    // ipl 
    //     team 
    //         player 
    //             run balls four six sr opponent venue date 
    // venue date -> .header-info .description
    // venue date -> .card .header-info
    // for result -> .event .status-text
    let $ = cheerio.load(html);
    let descElem = $(".header-info .description");
    let result = $(".event .status-text");
    let stringArr = descElem.text().split(",");
    let venue = stringArr[1].trim();
    let date = stringArr[2].trim();
    result = result.text();

    let innings = $(".card.content-block.match-scorecard-table>.Collapsible");
    let htmlString = "";
    for (let i = 0; i < innings.length; i++) {
        // htmlString = $(innings[i]).html();
        //team 
        let teamName = $(innings[i]).find("h5").text();
        teamName = teamName.split("INNINGS")[0].trim();
        let opponentIndex = i == 0 ? 1 : 0;
        let opponentTeamName = $(innings[opponentIndex]).find("h5").text();
        opponentTeamName = opponentTeamName.split("INNINGS")[0].trim();
        let cInning = $(innings[i]);
        console.log(`${venue} | ${date} | ${teamName} | ${opponentTeamName} | ${result}`);
        let allRows = cInning.find(".table.batsman tbody tr");
        for (let j = 0; j < allRows.length; j++) {
            let allCols = $(allRows[j]).find("td");
            let isWorthy = $(allCols[0]).hasClass("batsman-cell");
            if (isWorthy == true) {
                let playerName = $(allCols[0]).text().trim();
                let runs = $(allCols[2]).text().trim();
                let balls = $(allCols[3]).text().trim();
                let fours = $(allCols[5]).text().trim();
                let sixes = $(allCols[6]).text().trim();
                let sr = $(allCols[7]).text().trim();
                console.log(`${playerName} | ${runs} | ${balls} | ${fours} | ${sixes} | ${sr}`);

                processPlayer(teamName,playerName,runs,balls,fours,sixes,sr,opponentTeamName,venue,date,result);
            }

        }
        //player 
        // run four six sr opponent
    }
    // console.log(htmlString);

}

function processPlayer(teamName,playerName,runs,balls,fours,sixes,sr,opponentTeamName,venue,date,result){
    let teamPath = path.join(__dirname,"ipl",teamName);
    dirCreater(teamPath);
    let filePath = path.join(teamPath,playerName+".xlsx");
    let content = excelReader(filePath,playerName);
    let playerObj = {
        teamName,
        playerName,
        runs,
        balls,
        fours,
        sixes,
        sr,
        opponentTeamName,
        venue,
        date,
        result
    }
    content.push(playerObj);
    excelWrite(filePath,content,playerName);
}

function dirCreater(filePath){
    if(fs.existsSync(filePath) == false){
        fs.mkdirSync(filePath);
    }
}

function excelWrite(filePath, json, sheetName) {
    let newWorkBook = xlsx.utils.book_new();
    let newWorkSheet = xlsx.utils.json_to_sheet(json);
    xlsx.utils.book_append_sheet(newWorkBook, newWorkSheet, sheetName);
    xlsx.writeFile(newWorkBook, filePath);
}
function excelReader(filePath, sheetName) {
    if (fs.existsSync(filePath) == false) return [];
    let wb = xlsx.readFile(filePath);
    let exelsData = wb.Sheets[sheetName];
    let ans = xlsx.utils.sheet_to_json(exelsData);
    return ans;
}

module.exports = {
    ps: processScorecard
}