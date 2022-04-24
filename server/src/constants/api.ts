export const jioSaavnEndpoint = {
  trending:
    "https://www.jiosaavn.com/api.php?__call=webapi.getLaunchData&api_version=4&_format=json&_marker=0&ctx=wap6dot0",
  topSearches:
    "https://www.jiosaavn.com/api.php?__call=content.getTopSearches&ctx=wap6dot0&api_version=4&_format=json&_marker=0",
  search: (searchQuery: string) =>
    `https://www.jiosaavn.com/api.php?__call=autocomplete.get&_format=json&_marker=0&ctx=wap6dot0&query=${searchQuery}`,
  songById: (id: string) =>
    `https://www.jiosaavn.com/api.php?__call=webapi.get&type=song&includeMetaTags=0&api_version=4&_format=json&ctx=wap6dot0&_marker=0&token=${id}`,
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
