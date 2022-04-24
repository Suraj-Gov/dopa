export const jioSaavnEndpoint = {
  trending:
    "https://www.jiosaavn.com/api.php?__call=webapi.getLaunchData&api_version=4&_format=json&_marker=0&ctx=wap6dot0",
  topSearches:
    "https://www.jiosaavn.com/api.php?__call=content.getTopSearches&ctx=wap6dot0&api_version=4&_format=json&_marker=0",
  search: (searchQuery: string) =>
    `https://www.jiosaavn.com/api.php?__call=autocomplete.get&_format=json&_marker=0&ctx=wap6dot0&query=${searchQuery}`,
  songById: (id: string) =>
    `https://www.jiosaavn.com/api.php?_format=json&__call=song.getDetails&cc=in&_marker=0%3F_marker%3D0&pids=${id}`,
  playlistById: (id: string) =>
    `https://www.jiosaavn.com/api.php?_format=json&__call=playlist.getDetails&cc=in&_marker=0%3F_marker%3D0&listid=${id}`,
  albumById: (id: string) =>
    `https://www.jiosaavn.com/api.php?__call=content.getAlbumDetails&_format=json&cc=in&_marker=0%3F_marker=0&albumid=${id}`,
  artistByToken: (token: string) =>
    `https://www.jiosaavn.com/api.php?__call=webapi.get&type=artist&n_song=50&n_album=50&includeMetaTags=0&ctx=wap6dot0&api_version=4&_format=json&_marker=0&token=${token}`,
  createStation: (id: string[]) => {
    const songArr = id.map((i) => `"${i}"`).join(",");
    return `https://www.jiosaavn.com/api.php?__call=webradio.createEntityStation&entity_type=queue&api_version=4&_format=json&_marker=0&ctx=wap6dot0entity_id=[${songArr}]`;
  },
  songsFromStation: (stationid: string, songCount: number) =>
    `https://www.jiosaavn.com/api.php?__call=webradio.getSong&k=${songCount}&next=0&api_version=4&_format=json&_marker=0&ctx=wap6dot0&stationid=${stationid}`,
};

const lastFmApiKey = process.env.LASTFM_KEY;

export const lastFmEndpoint = {
  search: {
    album: (albumQuery: string) =>
      `http://ws.audioscrobbler.com/2.0/?method=album.search&album=${albumQuery}&api_key=${lastFmApiKey}&format=json`,
    artist: (artistQuery: string) =>
      `http://ws.audioscrobbler.com/2.0/?method=artist.search&artist=${artistQuery}&api_key=${lastFmApiKey}&format=json&autocorrect=1`,
  },
  // TODO similar, top
};
