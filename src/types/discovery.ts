export interface CreatorDetailResponse {
  success: boolean;
  message: string;
  data: CreatorDetailData;
  metadata: any;
}

export interface CreatorDetailData {
  profile: CreatorProfile;
  settings: CreatorSettings;
  sections: CreatorSection[];
  soundBoard: SoundBoardItem[];
}

export interface SoundBoardItem {
  id: string;
  name: string;
  duration: string;
  price: number;
  audioUrl: string;
}

export interface CreatorSettings {
  isMediaShareEnabled: boolean;
  isSoundEnabled: boolean;
  minAlertAmount: number;
  fastAmounts: number[];
  paymentMethods: {
    key: string;
    name: string;
    description?: string;
    isInternational: boolean;
  }[];
}

export interface CreatorProfile {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  bannerUrl: string;
  bio: string;
  isVerified: boolean;
  isLive: boolean;
  description: string;
  isFollowing: boolean;
  socials: {
    platform: string;
    url: string;
  }[];
}

export interface CreatorSection {
  id: string;
  type:
    | "COMMUNITY_QUEST"
    | "ACHIEVEMENTS"
    | "TOP_SUPPORTERS"
    | "PINNED_WIDGET"
    | "RECENT_ACTIVITY"
    | "CUSTOM_CONTENT"
    | "LEADERBOARD";
  title: string;
  isEnabled: boolean;
  data: any;
}
