class Track{
    constructor( name, duration, genres ){
        this.name = name;
        this.duration = duration;
        this.genres = genres;
    }

    includesGenres( genres ){
        return this.genres.some( genre => genres.includes(genre) )
    }
}

module.exports = {
    Track,
  };