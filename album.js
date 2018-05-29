class Album{
    constructor( name, year ){
        this.id = null;
        this.name = name;
        this.year = year;
        this.tracks = [];
    }

    getTracks(){
        return this.tracks
    }
}

module.exports = {
    Album,
  };