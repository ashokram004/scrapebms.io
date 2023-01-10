var express = require("express");
const { default: puppeteer } = require("puppeteer")
var app = express();
const url = "https://in.bookmyshow.com/buytickets/waltair-veerayya-hyderabad/movie-hyd-ET00343088-MT/20230113"

async function webscrape() {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(url)
    var moviename = await page.$eval(".cinema-name-wrapper",(el) => el.innerText)
    var mdate = await page.$eval(".slick-active",(el) => el.innerText)
    mdate = (mdate.split("\n")).join(" ")
    var content = await page.$eval("#venuelist",(el) => el.innerHTML)
    var sold = (content.match(/showtime-pill-container _sold/g)).length
    var filling = (content.match(/showtime-pill-container _filling/g)).length 
    var available = (content.match(/showtime-pill-container _available/g)).length
    var total = sold + filling + available
    app.engine('html', require('ejs').renderFile);
    app.get('/', function(req, res) {
        res.render(__dirname + "/views/index.html", {moviename:moviename,mdate:mdate, sold:sold, filling:filling, available:available,total:total });
    });

    app.listen(8080);
    console.log("Check this http://localhost:8080");
        await browser.close()
    }

webscrape()