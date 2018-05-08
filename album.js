class Album{
    constructor( name, year ){
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