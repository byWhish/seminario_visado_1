class PlayList{
    constructor( name, genresToInclude, maxDuration ){
        this.name = name;
        this.genresToInclude = genresToInclude;
        this.maxDuration = maxDuration;
        this.tracks = [];
    }

    duration(){
        return this.maxDuration;
    }

    hasTrack(aTrack){
        return this.tracks.includes(aTrack);
    }

}

module.exports = {
    PlayList,
  };