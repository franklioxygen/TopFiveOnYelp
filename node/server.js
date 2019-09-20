const express = require('express');
const app = express();
const bodyParser = require('body-parser')
app.use(bodyParser.json());
const cors = require('cors')
app.use(cors())

const yelp = require('yelp-fusion');
const apiKey = 'GRV9E4K9Na1GbpJkUMHNQRmTIBFXeeDUl85ySWIzvqGdEFh7d-BfRZZhCVsS72jXj5YKBKajI7Yy1KDUDgRR3xQA5mmA_sQdlctop2KYIijduiR_MqMnSxgIURJ8XXYx';
const client = yelp.client(apiKey);

app.get('/', (req, res) => {
    const searchRequest = {
        term: req.query.term,
        location: req.query.location,
        limit: 50
    };
    client.search(searchRequest).then(response => {
        const result = response.jsonBody;
        const resFiltered = result.businesses.filter(function (el) {
            // find shops has rating over 4 and reviews over 50, sort by review number, select top 5
            return el.rating >= 4 && el.review_count > 50;
        }).sort((a, b) => (a.review_count < b.review_count)).splice(0, 5);
        res.send(resFiltered);
    }).catch(e => {
        console.log(e);
    });
});

// calls localhost:8080/reviews api to fetch one review
app.get('/reviews', (req, res) => {
    client.reviews(req.query.id).then(response => {
        res.send(response.jsonBody.reviews[0]);
    }).catch(e => {
        console.log(e);
    });
});

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});