export type IntegerType = {
  value: bigint;
};

export type TParticipantProfilePhoto = {
  CONSTRUCTOR_ID: number;
  SUBCLASS_OF_ID: number;
  className: 'UserProfilePhoto';
  classType: 'constructor';
  flags: number;
  hasVideo: boolean;
  personal: boolean;
  photoId: IntegerType;
  strippedThumb: string | null;
  dcId: number;
};

export type TParticipantUserStatusRecently = {
  CONSTRUCTOR_ID: number;
  SUBCLASS_OF_ID: number;
  className: 'UserStatusRecently';
  classType: 'constructor';
  flags: number;
  byMe: boolean;
};

export type TParticipantUser = {
  CONSTRUCTOR_ID: number;
  SUBCLASS_OF_ID: number;
  className: 'User';
  classType: 'constructor';

  flags: number;

  self: boolean;
  contact: boolean;
  mutualContact: boolean;
  deleted: boolean;
  bot: boolean;
  botChatHistory: boolean;
  botNochats: boolean;
  verified: boolean;
  restricted: boolean;
  min: boolean;
  botInlineGeo: boolean;
  support: boolean;
  scam: boolean;
  applyMinPhoto: boolean;
  fake: boolean;
  botAttachMenu: boolean;
  premium: boolean;
  attachMenuEnabled: boolean;

  flags2: number;

  botCanEdit: boolean;
  closeFriend: boolean;
  storiesHidden: boolean;
  storiesUnavailable: boolean;
  contactRequirePremium: boolean;
  botBusiness: boolean;
  botHasMainApp: boolean;

  id: IntegerType;
  accessHash: IntegerType;

  firstName: string | null;
  lastName: string | null;
  username: string | null;
  phone: string | null;

  photo: TParticipantProfilePhoto | null;
  status: TParticipantUserStatusRecently | null;

  botInfoVersion: number | null;
  restrictionReason: unknown[] | null;
  botInlinePlaceholder: string | null;
  langCode: string | null;

  emojiStatus: unknown | null;
  usernames: unknown[] | null;
  storiesMaxId: number | null;
  color: unknown | null;
  profileColor: unknown | null;
  botActiveUsers: number | null;
  botVerificationIcon: unknown | null;
};