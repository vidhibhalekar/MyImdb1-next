export type Review = {
    id: string;
    text: string;
    rating: number;
    userId: string;
    movieId: string;
    createdAt: number;
  
    // ✅ ADD THIS
    up: number;
    down: number;
  
    flagged?: boolean;
  };