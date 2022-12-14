export const idlFactory = ({ IDL }) => {
  const AddPushTokenError = IDL.Variant({ UserNotFound: IDL.Null });
  const Result_14 = IDL.Variant({ ok: IDL.Null, err: AddPushTokenError });
  const AddToChatError = IDL.Variant({
    IdNotFound: IDL.Null,
    UserAlreadyInChat: IDL.Null,
    UserNotFound: IDL.Null,
  });
  const Result_13 = IDL.Variant({ ok: IDL.Null, err: AddToChatError });
  const BurnAccountError = IDL.Variant({ UserNotFound: IDL.Null });
  const Result_12 = IDL.Variant({ ok: IDL.Null, err: BurnAccountError });
  const CreateChatError = IDL.Variant({
    ChatAlreadyExists: IDL.Null,
    UserNotFound: IDL.Null,
  });
  const Result_11 = IDL.Variant({ ok: IDL.Null, err: CreateChatError });
  const MessageContent = IDL.Record({ message: IDL.Text });
  const Time = IDL.Int;
  const Message = IDL.Record({
    id: IDL.Nat,
    content: MessageContent,
    time: Time,
    sender: IDL.Principal,
  });
  const SharedChat = IDL.Record({
    messages: IDL.Vec(Message),
    otherUsers: IDL.Vec(IDL.Principal),
  });
  const GetMyChatError = IDL.Variant({
    IdNotFound: IDL.Null,
    UserNotFound: IDL.Null,
  });
  const Result_10 = IDL.Variant({ ok: SharedChat, err: GetMyChatError });
  const ChatHeader = IDL.Record({
    id: IDL.Nat,
    key: IDL.Text,
    lastMessage: IDL.Opt(Message),
    otherUsers: IDL.Vec(IDL.Principal),
  });
  const GetMyChatHeadersError = IDL.Variant({ UserNotFound: IDL.Null });
  const Result_9 = IDL.Variant({
    ok: IDL.Vec(ChatHeader),
    err: GetMyChatHeadersError,
  });
  const Profile = IDL.Record({
    username: IDL.Text,
    userPrincipal: IDL.Principal,
  });
  const GetMyProfileError = IDL.Variant({ UserNotFound: IDL.Null });
  const Result_8 = IDL.Variant({ ok: Profile, err: GetMyProfileError });
  const GetProfileError = IDL.Variant({ UserNotFound: IDL.Null });
  const Result_7 = IDL.Variant({ ok: Profile, err: GetProfileError });
  const GetPublicKeyError = IDL.Variant({ UserNotFound: IDL.Null });
  const Result_6 = IDL.Variant({ ok: IDL.Text, err: GetPublicKeyError });
  const GetUsersError = IDL.Variant({ UserNotFound: IDL.Null });
  const Result_5 = IDL.Variant({
    ok: IDL.Vec(IDL.Principal),
    err: GetUsersError,
  });
  const GhostAccountError = IDL.Variant({ UserNotFound: IDL.Null });
  const Result_4 = IDL.Variant({ ok: IDL.Null, err: GhostAccountError });
  const LeaveChatError = IDL.Variant({
    IdNotFound: IDL.Null,
    UserNotFound: IDL.Null,
  });
  const Result_3 = IDL.Variant({ ok: IDL.Null, err: LeaveChatError });
  const ProfileUpdate = IDL.Record({ username: IDL.Text });
  const RegisterError = IDL.Variant({
    InvalidProfile: IDL.Null,
    AlreadyRegistered: IDL.Null,
  });
  const Result_2 = IDL.Variant({ ok: IDL.Null, err: RegisterError });
  const RemovePushTokenError = IDL.Variant({ UserNotFound: IDL.Null });
  const Result_1 = IDL.Variant({
    ok: IDL.Null,
    err: RemovePushTokenError,
  });
  const SendMessageError = IDL.Variant({
    IdNotFound: IDL.Null,
    UserNotFound: IDL.Null,
  });
  const Result = IDL.Variant({ ok: SharedChat, err: SendMessageError });
  return IDL.Service({
    addPushToken: IDL.Func([IDL.Text, IDL.Text], [Result_14], []),
    addToChat: IDL.Func([IDL.Nat, IDL.Principal, IDL.Text], [Result_13], []),
    burnAccount: IDL.Func([], [Result_12], []),
    createChat: IDL.Func([IDL.Principal, IDL.Text, IDL.Text], [Result_11], []),
    getMyChat: IDL.Func([IDL.Nat], [Result_10], ["query"]),
    getMyChatHeaders: IDL.Func([], [Result_9], ["query"]),
    getMyProfile: IDL.Func([], [Result_8], ["query"]),
    getProfile: IDL.Func([IDL.Principal], [Result_7], ["query"]),
    getPublicKey: IDL.Func([IDL.Principal], [Result_6], ["query"]),
    getUsers: IDL.Func([IDL.Text], [Result_5], ["query"]),
    ghostAccount: IDL.Func([], [Result_4], []),
    isRegistered: IDL.Func([], [IDL.Bool], ["query"]),
    leaveChat: IDL.Func([IDL.Nat], [Result_3], []),
    register: IDL.Func([ProfileUpdate, IDL.Text], [Result_2], []),
    removePushToken: IDL.Func([IDL.Text], [Result_1], []),
    sendMessage: IDL.Func([IDL.Nat, MessageContent], [Result], []),
  });
};
export const init = ({ IDL }) => {
  return [];
};
