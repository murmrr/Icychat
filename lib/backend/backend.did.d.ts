import type { Principal } from "@dfinity/principal";
import type { ActorMethod } from "@dfinity/agent";

export interface ChatHeader {
  id: bigint;
  otherUsers: Array<Principal>;
}
export type CreateChatError =
  | { ChatAlreadyExists: null }
  | { UserNotFound: null };
export type GetMyChatError = { IdNotFound: null } | { UserNotFound: null };
export type GetMyChatHeadersError = { UserNotFound: null };
export type GetMyProfileError = { UserNotFound: null };
export type GetProfileError = { UserNotFound: null };
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
export type Result = { ok: null } | { err: UpdateProfileError };
export type Result_1 = { ok: null } | { err: SendMessageError };
export type Result_2 = { ok: null } | { err: RegisterError };
export type Result_3 = { ok: Profile } | { err: GetProfileError };
export type Result_4 = { ok: Profile } | { err: GetMyProfileError };
export type Result_5 =
  | { ok: Array<ChatHeader> }
  | { err: GetMyChatHeadersError };
export type Result_6 = { ok: SharedChat } | { err: GetMyChatError };
export type Result_7 = { ok: null } | { err: CreateChatError };
export type SendMessageError = { IdNotFound: null } | { UserNotFound: null };
export interface SharedChat {
  messages: Array<Message>;
  otherUsers: Array<Principal>;
}
export type Time = bigint;
export type UpdateProfileError = { ProfileNotFound: null };
export interface _SERVICE {
  createChat: ActorMethod<[Principal], Result_7>;
  getMyChat: ActorMethod<[bigint], Result_6>;
  getMyChatHeaders: ActorMethod<[], Result_5>;
  getMyProfile: ActorMethod<[], Result_4>;
  getProfile: ActorMethod<[Principal], Result_3>;
  register: ActorMethod<[ProfileUpdate], Result_2>;
  registerHelper: ActorMethod<[Principal, ProfileUpdate], Result_2>;
  sendMessage: ActorMethod<[bigint, MessageContent], Result_1>;
  updateProfile: ActorMethod<[ProfileUpdate], Result>;
}
