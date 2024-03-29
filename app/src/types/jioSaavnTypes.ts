// TODO make monorepo for types (use zod)
interface jsBaseI {
  id: string;
  title: string;
  language?: string;
  year: string;
  image: string;
  role?: string;
  release_date: string /** YYYY-MM-DD */;
  url?: string;
}

interface jsArtistMapI {
  id: string;
  name: string;
}

interface jsMoreInfoI {
  more_info?: {
    album_id: string;
    album: string;
    encrypted_media_url: string;
    query: string;
    text: string;
    primary_artists?: string /** the artist's name */;
    music?: string /** the artist's name */;
    song_count: string /** integer */;
    artistMap: {
      primary_artists: jsArtistMapI[];
      featured_artists: jsArtistMapI[];
      artists: jsArtistMapI[];
    };
  };
}

export interface jsAlbumI extends jsBaseI, jsMoreInfoI {
  name: string;
  type: "album";
  primary_artists: string;
  primary_artists_id: string;
  albumid: string;
  songs?: jsSongI[] /** available when fetched by id */;
}

interface jsSimilarArtistI extends jsBaseI {
  name: string;
  similar: string /** json format of jsArtistMapI shape */;
  image_url: string;
  type: "artist";
}

export interface jsArtistI extends jsBaseI, jsMoreInfoI {
  perma_url: string;
  type: "artist";
  artistId: string;
  name: string;
  topSongs: jsSongI[];
  topAlbums: jsAlbumI[];
  singles: jsSongI[];
  similarArtists: jsSimilarArtistI[];
}

export interface jsSongI extends jsBaseI, jsMoreInfoI {
  song: string /** title of the song */;
  album: string;
  type: "song";
  music: string /** (unconfirmed) artist's name */;
  music_id: string /** not used anywhere yet */;
  primary_artists: string /** comma separated */;
  primary_artists_id: string /** comma separated */;
  featured_artists?: string /** comma separated */;
  featured_artists_id?: string /** comma separated */;
  singers: string /** comma separated */;
  starring?: string;
  label: string;
  albumid: string;
  copyright_text: string;
  explicit_content: 1 | 0 | "1" | "0";
  "320kbps": "true" | "false";
  encrypted_media_url: string;
  encrypted_media_path: string;
  duration: string /** integer */;
}

export interface jsPlaylistI extends jsBaseI {
  type: "playlist";
  listname: string;
  list?: (jsSongI & jsMoreInfoI)[];
  songs: (jsSongI & jsMoreInfoI)[];
}

export interface jsTrendingI {
  artist_recos: jsArtistI[];
  charts: jsPlaylistI[];
  new_albums: jsAlbumI[];
  new_trending: (jsAlbumI | jsArtistI | jsPlaylistI | jsSongI)[];
  top_playlists: jsPlaylistI[];
}

export type jsAnyI = jsSongI | jsArtistI | jsAlbumI | jsPlaylistI;
export type jsEntityType = "song" | "playlist" | "album" | "artist";

export interface jsSearchResultsI {
  albums: {
    data: jsAlbumI[];
  };
  songs: {
    data: jsSongI[];
  };
  playlists: {
    data: jsPlaylistI[];
  };
  artists: {
    data: jsArtistI[];
  };
  topquery: {
    data: jsAnyI[];
  };
  shows: any[]; // ignore this
}
