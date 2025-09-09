export type Comment = {
    id: string;
    author: string;
    text: string;
    created_at: string; // ISO
    likes: number;
    images: string[];
  };
  
  export type Paginated<T> = {
    count?: number;
    next: string | null;
    previous?: string | null;
    results: T[];
  };