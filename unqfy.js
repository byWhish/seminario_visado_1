const picklejs = require('picklejs');
const artist = require('./artist');
const album = require('./album');
const track = require('./track');
const playlist = require('./playlist');
const modelExep = require('./ModelException');
const notificador = require('./Notificador'); 

class UNQfy {

  constructor(){
    this.artists = [];
    this.playLists = [];
    this.lastArtistId = 1;
    this.lasAlbumId = 1;
    this.notificador = new notificador.Notificador()
  }

  getAlbums(){
    let a = [];
    return this.artists.map( artista => artista.getAlbums() )
                          .reduce( (a,b) => a.concat(b), [] );
  }

  getTracks(){
    let a = [];
    return this.getAlbums().map( album => album.tracks )
                            .reduce( (a,b) => a.concat(b), [] );
  }

  getTracksMatchingGenres(genres) {
    return this.getTracks().filter( track => track.includesGenres(genres) );
  }

  getTracksMatchingArtist(artistName) {
    return this.getArtistByName(artistName.name).getTracks();
  }
  
  /* Debe soportar al menos:
     params.name (string)
     params.country (string)
  */
  addArtist(params) {
    if ( this.artists.find( artist => artist.name === params.name && artist.country === params.country ) ){
      throw new modelExep.DuplicatedException('Artista duplicado');
    }
    let aArtist = new artist.Artist( params.name, params.country );
    aArtist.id = this.lastArtistId++;
    this.artists.push( aArtist );
    return aArtist;
    // El objeto artista creado debe soportar (al menos) las propiedades name (string) y country (string)
  }

  /* Debe soportar al menos:
      params.name (string)
      params.year (number)
  */
  addAlbum(artistName, params) {
    if ( this.getAlbums().find( album => album.name === params.name && album.year === params.year ) ){
      throw new modelExep.DuplicatedException( "album duplicado" )  
    }
    let aAlbum = new album.Album( params.name, params.year );
    aAlbum.id = this.lasAlbumId++
    let aArtist = this.getArtistByName(artistName);
    //si no existe el artista lanzo una excepcion
    aArtist.albums.push( aAlbum );
    this.notificador.notificarNuevoAlbum(aArtist, aAlbum)
    return aAlbum;
    // El objeto album creado debe tener (al menos) las propiedades name (string) y year
  }
  /* Debe soportar (al menos):
       params.name (string)
       params.duration (number)
       params.genres (lista de strings)
  */
  addTrack(albumName, params) {
    let aTrack = new track.Track( params.name, params.duration, params.genres);
    let aAlbum = this.getAlbumByName(albumName);
    aAlbum.tracks.push( aTrack );
    /* El objeto track creado debe soportar (al menos) las propiedades:
         name (string),
         duration (number),
         genres (lista de strings)
    */
  }

  getArtistByName(name) {
    let artistFound = this.artists.find( artist => artist.name === name );
    if ( !artistFound ){ throw new modelExep.NotFoundException('Artista no encontrado') }
    return artistFound;
  }

  //busca un artista por id
  getArtistById(id){
    let artistFound = this.artists.find( artist => artist.id == id );
    if ( !artistFound ){ throw new modelExep.NotFoundRelException('Artista no encontrado') }  
    return artistFound;
  }

  //busca todos los artistas que incluyan la palabra
  getArtistsByName(name){
    return this.artists.filter( artist => artist.name.toUpperCase().includes(name.toUpperCase()));
  }

  deleteArtistById(id){
    this.getArtistById(id);
    this.artists = this.artists.filter( artist => artist.id != id );
    this.notificador.notificarArtistaBorrado(id)
  }

  getAlbumsByArtist(artistName) {
    let artist = this.getArtistByName( artistName )
    let albumsFound = artist.getAlbums();
  }

  getAlbumById(id) {
    let albumFound = this.getAlbums().find( album => album.id == id )
    if (!albumFound){ throw new modelExep.NotFoundException('Album no encontrado')}
    return albumFound
  }

  getAlbumsByName(name){
    let albumsFound =  this.getAlbums().filter( album => album.name.toUpperCase().includes(name.toUpperCase())) 
    return albumsFound
  }
  
  getAlbumByName(name) {
    let album = this.getAlbums().find( album => album.name === name );
    if (!album){ throw new modelExep.NotFoundException('Album no encontrado')}
    return album
  }

  deleteAlbumById(id) {
    let albumFound = this.getAlbumById(id)
    let artistFound = this.artists.find( artist => artist.albums.includes(albumFound) );
    artistFound.albums = artistFound.albums.filter( album => album !== albumFound ); 
  }

  getArtistByAlbum(aAlbum) {
    return this.artists.find( artist => artist.getAlbums().contains(aAlbum) )
  }

  getTrackByName(name) {
    let track = this.getTracks().find( track => track.name === name );
    if (!track){ throw new modelExep.NotFoundException('Track no encontrado')}
    return track
  }

  getPlaylistByName(name) {
    return this.playLists.find( playlist => playlist.name === name );
  }

  addPlaylist(name, genresToInclude, maxDuration) {

    let aPlayList = new playlist.PlayList(name,genresToInclude,maxDuration);

    let tracks = [] 
    this.getTracks().filter( track => track.genres.some( genre => genresToInclude.includes(genre))).
                                    forEach(track => {
                                                if ( track.duration <= maxDuration ){
                                                    maxDuration = maxDuration - track.duration;
                                                    tracks.push( track )
                                                    }
                                            });

    aPlayList.tracks = tracks;
    
    this.playLists.push( aPlayList );
    /* El objeto playlist creado debe soportar (al menos):
      * una propiedad name (string)
      * un metodo duration() que retorne la duración de la playlist.
      * un metodo hasTrack(aTrack) que retorna true si aTrack se encuentra en la playlist
    */

  }

  save(filename = 'unqfy.json') {
    new picklejs.FileSerializer().serialize(filename, this);
  }

  static load(filename = 'unqfy.json') {
    const fs = new picklejs.FileSerializer();
    // TODO: Agregar a la lista todas las clases que necesitan ser instanciadas
    const classes = [UNQfy, artist.Artist, album.Album, track.Track, playlist.PlayList];
    fs.registerClasses(...classes);
    return fs.load(filename);
  }
}

// TODO: exportar todas las clases que necesiten ser utilizadas desde un modulo cliente
module.exports = {
  UNQfy,
};
