let express    = require('express');        
let app        = express();                 
let bodyParser = require('body-parser');

const unqfy = require('./unqfy');
const picklejs = require('picklejs');
const artist = require('./artist');
const album = require('./album');
const track = require('./track');
const playlist = require('./playlist');

let unqfyInst = new unqfy.UNQfy;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let port = process.env.PORT || 8080;

let router = express.Router(); 

router.get('/', function(req, res) {
    res.json({ message: 'Welcome to our api!' });   
});

app.use('/api', router);

router.route('/artists/:id').delete(function (req, res) {
    let artistFound = unqfyInst.deletetArtistById(req.params.id)
    //res.json(JSON.stringify(artistFound));
});

router.route('/artists/:id').get(function (req, res) {
    let artistFound = unqfyInst.getArtistById(req.params.id)
    res.json(JSON.stringify(artistFound));
});

router.route('artists/').get(function (req, res) {
    let artistsFound = unqfyInst.getArtistsByName(req.query.name)
    res.jon(JSON.stringify(artistFound));
})
// create a track (accessed at POST http://localhost:8080/api/track)
router.route('/artists').post(function (req, res) {
        let newArtist = new artist.Artist(req.body.name, req.body.country)
        newArtist = unqfyInst.addArtist( newArtist );
        res.json(JSON.stringify(newArtist));
    });


app.listen(port);
console.log('Magic happens on port ' + port);