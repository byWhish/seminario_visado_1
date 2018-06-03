let express    = require('express');        
let app        = express();                 
let bodyParser = require('body-parser');

const unqfy = require('./unqfy');
const picklejs = require('picklejs');
const artist = require('./artist');
const album = require('./album');
const track = require('./track');
const playlist = require('./playlist');
const apiError = require('./ApiError');
const modelError = require('./ModelException')

function errorHandler(err, req, res, next) {
    console.error(err); // imprimimos el error en consola
    // Chequeamos que tipo de error es y actuamos en consecuencia
    if (err instanceof apiError.ApiError){
    res.status(err.status);
    res.json({status: err.status, errorCode: err.errorCode});
    } else if (err.type === 'entity.parse.failed'){
    // body-parser error para JSON invalido
    res.status(err.status);
    res.json({status: err.status, errorCode: 'BAD_REQUEST'});
    } else {
    // continua con el manejador de errores por defecto
    next(err);
    }
}

let unqfyInst = new unqfy.UNQfy;

let router = express.Router(); 

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/api', router);
app.use((req, res, next)=>{
    next( new apiError.InvalidUrl )
})
app.use(errorHandler);

let port = process.env.PORT || 5000;

function modelErrorToApiError( error ){
    if ( error instanceof modelError.DuplicatedException ){
        return new apiError.DuplicatedRes 
    } else if ( error instanceof modelError.NotFoundException ){
        return new apiError.NotFoundRes
    } else if ( error instanceof modelError.NotFoundRelException ){
        return new apiError.NotFoundRelRes
    } else {
        return new apiError.InvalidUrl
    }
}

router.route('/lyrics/').get( (req, res, next) => {

});

router.route('/artists').post( (req, res, next) => {
    try {
        if ( req.body.name && req.body.country ){
            let newArtist = new artist.Artist(req.body.name, req.body.country)
            newArtist = unqfyInst.addArtist( newArtist );
            res.status(200);
            res.json(newArtist);
        }else{
            next( new apiError.BadRequest )
        }
    }catch(error){ 
        next( modelErrorToApiError(error) )
    }
});

router.route('/artists/:id').get( (req, res, next) => {
    try {
        if ( req.params.id ){
            let artistFound = unqfyInst.getArtistById(req.params.id)
            res.status(200);
            res.json(artistFound);
        }else{
            next( new apiError.BadRequest );
        }
    }catch(error){
        next( modelErrorToApiError(error) )
    }
});

router.route('/artists/:id').delete( (req, res, next) => {
    try {
    unqfyInst.deleteArtistById(req.params.id)
    res.status(200);
    res.json({message:'borrado Ok'})
    //next()
    }catch(error){
        next( modelErrorToApiError(error) )
    }
});

router.route('/artists').get( (req, res, next) => {
    try {
        let artistsFound
        if ( req.query.name ){
            artistsFound = unqfyInst.getArtistsByName(req.query.name)
        }else{
            artistsFound = unqfyInst.artists
        }
        res.status(200);
        res.json(artistsFound)
    }catch(error){
        next( modelErrorToApiError(error) )
    }
})

router.route('/albums').post(function (req, res, next) {
    try {
        if ( req.body.name && req.body.year && req.body.artistId ){
            let artistFound = unqfyInst.getArtistById(req.body.artistId)
            let newAlbum = unqfyInst.addAlbum(artistFound.name, {name:req.body.name,year:req.body.year})
            res.status(200);
            res.json(newAlbum);
        }else{
            next( new apiError.BadRequest)
        }
    }catch(error){
        next( modelErrorToApiError(error) )
    }
})

router.route('/albums').get(function (req, res, next) {
    try{
        let albumsFound
        if ( req.query.name ){ 
            albumsFound = unqfyInst.getAlbumsByName(req.query.name)
        }else{
            albumsFound = unqfyInst.getAlbums()
        }
        res.status(200);
        res.json(albumsFound);
    }catch(error){
        next( modelErrorToApiError(error) )
    }
})

router.route('/albums/:id').get(function (req, res, next) {
    try{
        if ( req.params.id ){
            let albumFound = unqfyInst.getAlbumById(req.params.id);
            res.status(200);
            res.json(albumFound);
        }else{
            next( new apiError.BadRequest )
        }
    }catch(error){
        next( modelErrorToApiError(error) )
    }
})

router.route('/albums/:id').delete(function (req, res, next) {
    try{
        if ( req.params.id ){
            unqfyInst.deleteAlbumById(req.params.id)
            res.status(200);
            res.json({message: 'Borrado Ok'});
        }else{
            next( new apiError.BadRequest )
        }
    }catch(error){
        next( modelErrorToApiError(error) )
    }
});

router.get('/', function(req, res) {
    res.status(200);
    res.json({ message: 'Welcome to our api!' });   
});

app.listen(port);
console.log('Magic happens on port ' + port);