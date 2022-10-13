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
export type Result_10 = { ok: null } | { err: BurnAccountError };
export type Result_11 = { ok: null } | { err: AddToChatError };
export type Result_2 = { ok: null } | { err: RegisterError };
export type Result_3 = { ok: Array<Principal> } | { err: GetUsersError };
export type Result_4 = { ok: string } | { err: GetPublicKeyError };
export type Result_5 = { ok: Profile } | { err: GetProfileError };
export type Result_6 = { ok: Profile } | { err: GetMyProfileError };
export type Result_7 =
  | { ok: Array<ChatHeader> }
  | { err: GetMyChatHeadersError };
export type Result_8 = { ok: SharedChat } | { err: GetMyChatError };
export type Result_9 = { ok: null } | { err: CreateChatError };
export type SendMessageError = { IdNotFound: null } | { UserNotFound: null };
export type SetPushTokenError = { UserNotFound: null };
export interface SharedChat {
  messages: Array<Message>;
  otherUsers: Array<Principal>;
}
export type Time = bigint;
export interface _SERVICE {
  addToChat: ActorMethod<[bigint, Principal, string], Result_11>;
  burnAccount: ActorMethod<[], Result_10>;
  createChat: ActorMethod<[Principal, string, string], Result_9>;
  getMyChat: ActorMethod<[bigint], Result_8>;
  getMyChatHeaders: ActorMethod<[], Result_7>;
  getMyProfile: ActorMethod<[], Result_6>;
  getProfile: ActorMethod<[Principal], Result_5>;
  getPublicKey: ActorMethod<[Principal], Result_4>;
  getUsers: ActorMethod<[string], Result_3>;
  register: ActorMethod<[ProfileUpdate, string], Result_2>;
  sendMessage: ActorMethod<[bigint, MessageContent], Result_1>;
  setPushToken: ActorMethod<[string], Result>;
}
