import type {
    CreateSongPayload,
    CreateSongResponse,
    CreatePlaylistPayload,
    CreatePlaylistResponse,
    GetSongsResponse,
    GetPlaylistsResponse,
    UpdateSongPayload,
    UpdateSongResponse,
    DeleteSongResponse,
    DeletePlaylistResponse,
    UpdatePlaylistPayload,
    UpdatePlaylistResponse,
} from "@lib/shared_types";
import axios from "axios";

import { env } from "./env";

const client = axios.create({
    baseURL: env.VITE_API_URL,
});

export function getPlaylists() {
    return client.get<GetPlaylistsResponse>("/playlists");
  }

  export function getSongs() {
    return client.get<GetSongsResponse>("/songs");
  }

  export function createPlaylist(input: CreatePlaylistPayload) {
    return client.post<CreatePlaylistResponse>("/playlists", input);
  }

  export function createSong(input: CreateSongPayload) {
    return client.post<CreateSongResponse>("/songs", input);
  }

  export function updateSong(id: string, input: UpdateSongPayload) {
    return client.put<UpdateSongResponse>(`/songs/${id}`, input);
  }

  export function updatePlaylist(id: string, input: UpdatePlaylistPayload) {
    return client.put<UpdatePlaylistResponse>(`/playlists/${id}`, input);
  }

  export function deleteSong(id: string) {
    return client.delete<DeleteSongResponse>(`/songs/${id}`);
  }

  export function deletePlaylist(id: string) {
    return client.delete<DeletePlaylistResponse>(`/playlists/${id}`);
  }

