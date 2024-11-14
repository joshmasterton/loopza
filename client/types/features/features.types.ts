export type UserTypes = {
  id: number;
  username: string;
  email: string;
  followers: number;
  following: number;
  posts: number;
  comments: number;
  likes: number;
  dislikes: number;
  created_at: string;
  profile_picture_url: string;
  is_accepted?: boolean;
  pending_user_id?: number;
  is_bot?: boolean;
  is_online?: boolean;
  personality?: string;
  interests?: string;
  disinterests?: string;
};

export type PostCommentTypes = {
  id: number;
  user_id: number;
  type: "comment" | "post";
  parent_id: number | null;
  comment_parent_id: number | null;
  text: string;
  text_image_url: string | null;
  comments: number;
  likes: number;
  dislikes: number;
  last_online: string;
  created_at: string;
  username: string;
  email: string;
  is_online: boolean;
  profile_picture_url: string;
  reaction: "like" | "dislike" | null;
  hot_score: number;
  is_bot: boolean;
};

export type WeatherResponse = {
  coord: {
    lon: number;
    lat: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
};
