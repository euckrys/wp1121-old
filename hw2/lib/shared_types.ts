export type SongData = {
    id: string;
    title: string;
    singer: string;
    link: string;
    list_id: string;
};

export type PlaylistData = {
    id: string;
    title: string;
    description: string;
    songs: SongData[];
}

export type GetSongsResponse = SongData[];

export type GetSongResponse = SongData;

export type CreateSongPayload = Omit<SongData, "id">;

export type CreateSongResponse = Pick<SongData, "id">;

export type UpdateSongPayload = Partial<Omit<SongData, "id">>;

export type UpdateSongResponse = "OK";

export type DeleteSongResponse = "OK";

export type GetPlaylistsResponse = Omit<PlaylistData, "songs">[];

export type CreatePlaylistPayload = Omit<PlaylistData, "id" | "songs">;

export type CreatePlaylistResponse = Pick<PlaylistData, "id">;

export type UpdatePlaylistPayload = Partial<Omit<PlaylistData, "id" | "songs">>;

export type UpdatePlaylistResponse = "OK";

export type DeletePlaylistResponse = "OK";

