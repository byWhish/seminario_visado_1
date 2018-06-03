const requester = require('./requester');

class Artist{
    
    constructor( name, country ){
        this.id = null
        this.name = name;
        this.country = country;
        this.albums = [];
    }

    getTracks(){
        let a = []
        return this.albums.map( album => album.getTracks()).
                            reduce( function (a,b) { return a.concat(b) }, []);
    }

    getAlbums(){
        let req = new requester.Requester();
        let titles = []
        //devuelvo una lista de titulos de albunes
        if ( !this.albums.length ){
            return this.albums.map( album => album.title() );
        } else {
            this.albums = req.requestAlbumsByArtistName(this.name)
        }
        
    }

}

module.exports = {
    Artist,
  };