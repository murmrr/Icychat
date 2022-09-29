export const idlFactory = ({ IDL }) => {
  const CreateChatError = IDL.Variant({
    ChatAlreadyExists: IDL.Null,
    UserNotFound: IDL.Null,
  });
  const Result_7 = IDL.Variant({ ok: IDL.Null, err: CreateChatError });
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
  const Result_6 = IDL.Variant({ ok: SharedChat, err: GetMyChatError });
  const ChatHeader = IDL.Record({
    id: IDL.Nat,
    otherUsers: IDL.Vec(IDL.Principal),
  });
  const GetMyChatHeadersError = IDL.Variant({ UserNotFound: IDL.Null });
  const Result_5 = IDL.Variant({
    ok: IDL.Vec(ChatHeader),
    err: GetMyChatHeadersError,
  });
  const Profile = IDL.Record({
    username: IDL.Text,
    userPrincipal: IDL.Principal,
  });
  const GetMyProfileError = IDL.Variant({ UserNotFound: IDL.Null });
  const Result_4 = IDL.Variant({ ok: Profile, err: GetMyProfileError });
  const GetProfileError = IDL.Variant({ UserNotFound: IDL.Null });
  const Result_3 = IDL.Variant({ ok: Profile, err: GetProfileError });
  const ProfileUpdate = IDL.Record({ username: IDL.Text });
  const RegisterError = IDL.Variant({
    InvalidProfile: IDL.Null,
    AlreadyRegistered: IDL.Null,
  });
  const Result_2 = IDL.Variant({ ok: IDL.Null, err: RegisterError });
  const SendMessageError = IDL.Variant({
    IdNotFound: IDL.Null,
    UserNotFound: IDL.Null,
  });
  const Result_1 = IDL.Variant({ ok: SharedChat, err: SendMessageError });
  const UpdateProfileError = IDL.Variant({ ProfileNotFound: IDL.Null });
  const Result = IDL.Variant({ ok: IDL.Null, err: UpdateProfileError });
  return IDL.Service({
    createChat: IDL.Func([IDL.Principal], [Result_7], []),
    getAllUsers: IDL.Func([], [IDL.Vec(IDL.Principal)], ["query"]),
    getMyChat: IDL.Func([IDL.Nat], [Result_6], ["query"]),
    getMyChatHeaders: IDL.Func([], [Result_5], ["query"]),
    getMyProfile: IDL.Func([], [Result_4], ["query"]),
    getProfile: IDL.Func([IDL.Principal], [Result_3], ["query"]),
    register: IDL.Func([ProfileUpdate], [Result_2], []),
    registerHelper: IDL.Func([IDL.Principal, ProfileUpdate], [Result_2], []),
    sendMessage: IDL.Func([IDL.Nat, MessageContent], [Result_1], []),
    updateProfile: IDL.Func([ProfileUpdate], [Result], []),
  });
};
export const init = ({ IDL }) => {
  return [];
};
