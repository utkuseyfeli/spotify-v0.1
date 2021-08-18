import { SpotifyUser } from "./user";

export interface PlayList{
    collaborative: boolean;
    id: string;
    name: string;
    description: string;
    images: Image[];
    owner: SpotifyUser;
    tracks: Track[];
    followers: number;
}

export interface Artist{
    name: string;
    popularity: number;
    genres: string[];
    id: string;
    followers: {
        total: number;
    },
    images: Image[]
}

export interface Album{
    artists: Artist[];
    name: string;
    total_tracks: number;
    release_date: string;
    images: Image[];
    id: string;
    tracks: Track[];
}

export interface Track{
    album: Album;
    artists: Artist[];
    name: string;
    popularity: number;
    id: string;
    preview_url: string;
}

export interface Image{
    height: number;
    url: string;
    width: number;
}
