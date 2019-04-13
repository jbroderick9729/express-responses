const express = require('express');
const morgan  = require('morgan');
const playstore = require('./playstore');
const cors = require('cors');


const app = express();

app.use(morgan('common'));
app.use(cors());


app.get('/apps', (req, res) => {
    const {  sort, genre } = req.query;

    if(sort) {
        if(!['Rating', 'App'].includes(sort)){
            return res
                .status(400)
                .send('Sort must be either Rating or App!')
        }
    }

    if(genre) {
        if(!['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card'].includes(genre)) {
            return res
                .status(400)
                .send('Genres must be either Action, Puzzle, Strategy, Casual, Arcade, or Card!')
        }
    }

    const results = {
        playstore: playstore.filter(item => item),
    };
    
    if(sort) {
        results.playstore
            .sort((a,b) => {
                return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0;
            })
    }
   
    if(genre) {
            results.playstore = results.playstore.filter(item => item.Genres.includes(genre) )
        }

    res
        .json(results.playstore);
})

app.listen(8001, () => {
    console.log('Server started on PORT 8001');
})