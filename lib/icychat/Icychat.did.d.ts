import type { Principal } from "@dfinity/principal";
import type { ActorMethod } from "@dfinity/agent";

export type AddToChatError =
  | { IdNotFound: null }
  | { UserAlreadyInChat: null }
  | { UserNotFound: null };
export type BurnAccountError = { UserNotFound: null };
export interface ChatHeader {
  id: bigint;
  key: string;
  lastMessage: [] | [Message];
  otherUsers: Array<Principal>;
}
export type CreateChatError =
  | { ChatAlreadyExists: null }
  | { UserNotFound: null };
export type GetMyChatError = { IdNotFound: null } | { UserNotFound: null };
export type GetMyChatHeadersError = { UserNotFound: null };
export type GetMyProfileError = { UserNotFound: null };
export type GetProfileError = { UserNotFound: null };
export type GetPublicKeyError = { UserNotFound: null };
export type GetUsersError = { UserNotFound: null };
export type LeaveChatError = { IdNotFound: null } | { UserNotFound: null };
export interface Message {
  id: bigint;
  content: MessageContent;
  time: Time;
  sender: Principal;
}
export interface MessageContent {
  message: string;
}
export interface Profile {
  username: string;
  userPrincipal: Principal;
}
export interface ProfileUpdate {
  username: string;
}
export type RegisterError =
  | { InvalidProfile: null }
  | { AlreadyRegistered: null };
export type Result = { ok: null } | { err: SetPushTokenError };
export type Result_1 = { ok: SharedChat } | { err: SendMessageError };
export type Result_10 = { ok: null } | { err: CreateChatError };
export type Result_11 = { ok: null } | { err: BurnAccountError };
export type Result_12 = { ok: null } | { err: AddToChatError };
export type Result_2 = { ok: null } | { err: RegisterError };
export type Result_3 = { ok: null } | { err: LeaveChatError };
export type Result_4 = { ok: Array<Principal> } | { err: GetUsersError };
export type Result_5 = { ok: string } | { err: GetPublicKeyError };
export type Result_6 = { ok: Profile } | { err: GetProfileError };
export type Result_7 = { ok: Profile } | { err: GetMyProfileError };
export type Result_8 =
  | { ok: Array<ChatHeader> }
  | { err: GetMyChatHeadersError };
export type Result_9 = { ok: SharedChat } | { err: GetMyChatError };
export type SendMessageError = { IdNotFound: null } | { UserNotFound: null };
export type SetPushTokenError = { UserNotFound: null };
export interface SharedChat {
  messages: Array<Message>;
  otherUsers: Array<Principal>;
}
export type Time = bigint;
export interface _SERVICE {
  addToChat: ActorMethod<[bigint, Principal, string], Result_12>;
  burnAccount: ActorMethod<[], Result_11>;
  createChat: ActorMethod<[Principal, string, string], Result_10>;
  getMyChat: ActorMethod<[bigint], Result_9>;
  getMyChatHeaders: ActorMethod<[], Result_8>;
  getMyProfile: ActorMethod<[], Result_7>;
  getProfile: ActorMethod<[Principal], Result_6>;
  getPublicKey: ActorMethod<[Principal], Result_5>;
  getUsers: ActorMethod<[string], Result_4>;
  leaveChat: ActorMethod<[bigint], Result_3>;
  register: ActorMethod<[ProfileUpdate, string], Result_2>;
  sendMessage: ActorMethod<[bigint, MessageContent], Result_1>;
  setPushToken: ActorMethod<[string], Result>;
}
