const PORT = process.env.PORT || 8000
const express = require('express')
const cheerio = require('cheerio')
const cheerioTableparser = require('cheerio-tableparser');
const axios = require('axios')
const path = require('path')

const app = express()

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.get('/', (req,res) => {

    top = []

    axios.get('https://www.coingecko.com/en')
    .then((response) => {
        const response_html = response.data
        const $ = cheerio.load(response_html)
        const top = []
        let count = 0

        $('div[class="coingecko-table"] table tbody tr').each((index, element) => {

            const tds = $(element).find("td")

            let name = $(tds[2]).find("div div.center a.tw-hidden").text()
            let icon = $(tds[2]).find("div div.coin-icon img").attr('data-src')
            let price = $(tds[3]).find("span").text()
            let market_cap = $(tds[8]).find("span").text()

            if(count < 10) {
                top.push({
                    name,
                    icon,
                    price,
                    market_cap
                })
            }
            count++
        });
        res.render('home', {top})
    })
})

app.listen(PORT, () => console.log('server running on PORT ' + PORT))