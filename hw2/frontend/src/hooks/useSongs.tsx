/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
} from "react";

import type { GetSongsResponse, GetPlaylistsResponse } from "@lib/shared_types";

import type { PlaylistProps } from "@/components/Playlist";

import { getSongs, getPlaylists } from "@/utils/client";


type SongContextType = {
    playlists: PlaylistProps[];
    fetchPlaylists: () => Promise<void>;
    fetchSongs: () => Promise<void>;
};

const SongContext = createContext<SongContextType>({
    playlists: [],
    fetchPlaylists: async () => {},
    fetchSongs: async () => {},
});

type SongProviderProps = {
    children: React.ReactNode;
};



export function SongProvider({ children }: SongProviderProps) {
    const [rawPlaylists, setRawPlaylists] = useState<GetPlaylistsResponse>([]);
    const [rawSongs, setRawSongs] = useState<GetSongsResponse>([]);

    const fetchPlaylists = useCallback(async () => {
        try {
            const { data } =await getPlaylists();
            setRawPlaylists(data);
        } catch (error) {
            alert("Error: failed to fetch playlists");
        }
    }, []);

    const fetchSongs = useCallback(async () => {
        try {
            const { data } = await getSongs();
            setRawSongs(data);
        } catch (error) {
            alert("Error: failed to fetch songs");
        }
    }, []);

    const playlists = useMemo(() => {
        const playlistMap = rawPlaylists.reduce(
            (acc, playlist) => {
                acc[playlist.id] = { ...playlist, songs: [], isButtonActive:false };
                return acc;
            },
            {} as Record<string, PlaylistProps>,
        );

        for (const song of rawSongs) {
            const playlist = playlistMap[song.list_id];
            if(!playlist) {
                continue;
            }
            playlistMap[song.list_id].songs.push({
                ...song,
                playlistId: song.list_id,
                isChecked: false,
                onCheckboxChange: (songId, isChecked) => {},
            });
        }
        return Object.values(playlistMap);
    }, [rawSongs, rawPlaylists]);

    return (
        <SongContext.Provider
          value={{
            playlists,
            fetchPlaylists,
            fetchSongs,
          }}
        >
            {children}
        </SongContext.Provider>
    );
}

export default function useSongs() {
    return useContext(SongContext);
}