export interface CreatorDetailResponse {
  status_code: number;
  message: string;
  data: CreatorDetailData;
  metadata: any;
}

export interface CreatorDetailData {
  profile: CreatorProfile;
  settings: CreatorSettings;
  sections: CreatorSection[];
  sound_board: SoundBoardItem[];
}

export interface SoundBoardItem {
  id: string;
  name: string;
  duration: string;
  price: number;
  audio_url: string;
}

export interface CreatorSettings {
  is_media_share_enabled: boolean;
  media_share_settings: {
    youtube: { is_enabled: boolean; max_duration_seconds: number; price_per_second: number };
    tiktok: { is_enabled: boolean; max_duration_seconds: number; price_per_second: number };
    reels: { is_enabled: boolean; max_duration_seconds: number; price_per_second: number };
    voice: { is_enabled: boolean; max_duration_seconds: number; price_per_second: number };
    gif: { is_enabled: boolean };
  } | null;
  is_sound_enabled: boolean;
  min_alert_amount: number;
  fast_amounts: number[];
  payment_methods: {
    key: string;
    name: string;
    description?: string;
    is_international: boolean;
  }[];
}

export interface CreatorProfile {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string;
  banner_url: string;
  bio: string;
  is_verified: boolean;
  is_live: boolean;
  is_following: boolean;
  socials: {
    platform: string;
    url: string;
  }[];
}

export interface CreatorSection {
  id: string;
  type:
    | "GOALS"
    | "ACHIEVEMENTS"
    | "TOP_SUPPORTERS"
    | "PINNED_WIDGET"
    | "RECENT_ACTIVITY"
    | "CUSTOM_CONTENT"
    | "LEADERBOARD";
  title: string;
  is_enabled: boolean;
  data: any;
}
