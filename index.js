
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const PORT = process.env.PORT3000

const app = express()


const newspapers = [{

    name: 'thetimes',
    address: 'https://www.theguardian.com/environment/climate-crisis',
    base: ''
},
{

    name: 'guardian',
    address: 'https://www.theguardian.com/environment/climate-crisis',
    base: ''
},
{
    name: 'telegraph',
    address: 'https://www.telegraph.co.uk/climate-change',
    base: 'https://www.telegraph.co.uk'
},
]
const articles = []

newspapers.forEach(newspapers => {

    axios.get(newspapers.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            $('a:contains("climate")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')

                articles.push({
                    title,
                    url: newspapers.base + url,
                    source: newspapers.name


                })



            })



        })



})
app.get('/', (req, res) => {
    res.send('Weather api')
})

app.get('/news', (req, res) => {
    res.send(articles)
})




app.get('/news/:newspaperId', (req, res) => {

    const newspaperId = req.params.newspaperId

    const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address
    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base


    console.log(newspaperAddress)

    axios.get(newspaperAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []

            $('a:contains("climate")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                specificArticles.push({
                    title,
                    url: newspaperBase + url,
                    source: newspaperId
                })
            })
            res.send(specificArticles)
        }).catch(err => console.log(err))


})

app.listen(PORT, () => console.log(`server running on port${PORT}`))
