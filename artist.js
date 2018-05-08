class Artist{
    
    constructor( name, country ){
        this.name = name;
        this.country = country;
        this.albums = [];
    }

    getTracks(){
        let a = []
        return this.albums.map( album => album.getTracks()).
                            reduce( function (a,b) { return a.concat(b) });
    }

}

module.exports = {
    Artist,
  };