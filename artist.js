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
                            reduce( function (a,b) { return a.concat(b) });
    }

    getAlbums(){
        let titles = []
        //devuelvo una lista de titulos de albunes
        return this.albums.map( album => album.title() );
    }

}

module.exports = {
    Artist,
  };