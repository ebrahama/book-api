const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');


const PORT = process.env.PORT || 5000
const app = express()



const enbooks = [
    {
        name: 'business-management',
        address: 'https://www.jarir.com/sa-en/english-business-management.html',
    },
    {
        name: 'law',
        address: 'https://www.jarir.com/sa-en/english-books/english-law.html',
    },
    {
        name: 'engineering',
        address: 'https://www.jarir.com/sa-en/english-books/english-engineering.html',
    },
    {
        name: 'computer-technology',
        address: 'https://www.jarir.com/sa-en/english-books/english-computer-technology.html',
    },
    {
        name: 'Health, Fitness & Dieting',
        address: 'https://www.jarir.com/sa-en/english-books/english-health-fitness-dieting.html',
    },
    {
        name: 'Self Development',
        address: 'https://www.jarir.com/sa-en/english-books/self-development-182.html',
    },
]

const articles = []

enbooks.forEach(books => {
    axios.get(books.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const c = books.name

            $('.product-tile__col', html).each(function () {
                const title = $(this).find('.product-title__title').text()
                const price = $(this).find('.price').text()

                articles.push({
                    title,
                    price,
                    type:c
                })
            })

        })
})

    app.get('/', (req, res) => {
        res.json('books API')
    })
    
    app.get('/en/books', (req, res) => {
        res.json(articles)
    })



    app.get('/en/books/:enbooksId', (req, res) => {
        const bookId = req.params.enbooksId

        const bookad =  enbooks.filter( enbook =>  enbook.name == bookId)[0].address
        const ty =  enbooks.filter( enbook =>  enbook.name == bookId)[0].name

                axios.get(bookad)
                .then(response => {
                    const html = response.data
                    const $ = cheerio.load(html)
                    const c = ty

                const specificArticles = []
    
                $('.product-tile__col', html).each(function () {
                    const title = $(this).find('.product-title__title').text()
                    const price = $(this).find('.price').text()
    
                    specificArticles.push({
                        title,
                        price,
                        type:c
                    })
                })

                res.json(specificArticles)

            }).catch(err => console.log(err))
    })


app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))