export interface PlayList{
    collaborative: boolean;
    id: string;
    name: string;
    description: string;
}

export interface Artist{
    name: string;
    popularity: number;
    genres: string[];
}

export interface Album{
    artists: Artist[];
    name: string;
    total_tracks: number;
    release_date: string;
}

export interface Track{
    album: Album;
    artists: Artist[];
    name: string;
    popularity: number;
    
}
