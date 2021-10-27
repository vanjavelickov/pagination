const express = require('express');
const app = express();
const faker = require('faker');
const cors = require('cors');
// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.use(cors({origin: '*'}));

app.get('/', (req, res) => {
    res.send('Hello world');
});

const users = Array.from({length: 45}, (_, i) => (
    {
        id: i.toString(),
        name: faker.name.findName(),
        email: faker.internet.email(),
        address: faker.address.streetAddress(),
        country: faker.address.country(),
        company: faker.company.companyName(),
    }
));

app.get('/api/users', paginated(users), (req, res) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    res.send({results: res.paginatedResults, hasMore: page < users.length / limit});
});

app.get('/api/users/:id', (req, res) => {
    res.send(users.find(user => user.id === req.params.id));
});

function paginated(data) {
    return (req, res, next) => {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
    
        if (isNaN(page) || isNaN(limit)) {
            res.status(400).send({message: 'Page and limit must be digits'});
        }

        if (page <= 0 || limit <= 0) {
            res.status(400).send({message: 'Page and limit must be greater than 0'});    
        }
    
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
    
        const result = users.slice(startIndex, endIndex);
        res.paginatedResults = result;
        next();
    }
}

app.post('/api/users', (req, res) => {
    const user = req.body;
    user.id = users.length;
    users.push(user);
    res.send();
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Listening on port ${port}`));

