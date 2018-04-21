
const picklejs = require('picklejs');
const artist = require('./artist');
const album = require('./album');
const track = require('./track');
const playlist = require('./playlist');

class UNQfy {

  constructor(){
    this.artists = [];
    this.playLists = [];
  }

  getAlbums(){
    let a = [];
    return this.artists.
              map( artist => artist.albums ).
              reduce( function (a,b) { return a.concat(b) });
  }

  getTracks(){
    let a = [];
    return this.getAlbums().
              map( album => album.tracks ).
              reduce( function (a,b) { return a.concat(b) });
  }

  getTracksMatchingGenres(genres) {
    return this.getTracks().filter( track => track.genres.some( genre => genres.includes(genre) ) );
  }

  getTracksMatchingArtist(artistName) {
    //let aArtist = this.artists.find( artist => artist === artistName )
    //let albums = aArtist.albums;
    let a = [];
    //let tracks = albums.map( album => album.tracks ).reduce( function (a,b) { return a.concat(b) });      
    return this.getArtistByName(artistName.name).albums.
                        map( album => album.tracks ).
                        reduce( function (a,b) { return a.concat(b) });      
  }


  /* Debe soportar al menos:
     params.name (string)
     params.country (string)
  */
  addArtist(params) {
    let aArtist = new artist.Artist( params.name, params.country );
    this.artists.push( aArtist );
    // El objeto artista creado debe soportar (al menos) las propiedades name (string) y country (string)
  }

  /* Debe soportar al menos:
      params.name (string)
      params.year (number)
  */
  addAlbum(artistName, params) {
    let aAlbum = new album.Album( params.name, params.year );
    let aArtist = this.getArtistByName(artistName);
    if ( aArtist === undefined ){
      console.log("No se econtro el Artista");
    }else{
      aArtist.albums.push( aAlbum );
    }
    //this.this.getArtistByName(artistName).albums.push( aAlbum );
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
    if ( aAlbum === undefined ){
      console.log("No se econtro el Album");
    }else{
      aAlbum.tracks.push( aTrack );
    }
    //this.getAlbumByName(albumName).tracks.push( aTrack );
    /* El objeto track creado debe soportar (al menos) las propiedades:
         name (string),
         duration (number),
         genres (lista de strings)
    */
  }

  getArtistByName(name) {
    return this.artists.find( artist => artist.name === name );
  }

  getAlbumByName(name) {
    //return this.albums;
    return this.getAlbums().find( album => album.name === name );
  }

  getTrackByName(name) {
    return this.getTracks().find( track => track.name === name );
  }

  getPlaylistByName(name) {
    return this.playLists.find( playlist => playlist.name === name );
  }

  addPlaylist(name, genresToInclude, maxDuration) {

    let aPlayList = new playlist.PlayList(name,genresToInclude,maxDuration);
    
    //filter(track => track.duration < maxDuration).


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
