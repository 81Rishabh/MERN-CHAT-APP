
export const URL = {
  sign_in : `api/auth/sign_in`,
  sign_up : `api/auth/sign_up`,
  profile : (id) => `api/auth/profile/${id}`,
  profile_upload : (id) => `api/auth/upload-profile/${id}`,
  get_users :  `api/auth/get_users`,
  getAllGroups : `api/chat/groups`,
  create_group : `api/chat/createGroupChat`,
  send_message : `api/chat/create_single_chat`,
  send_group_message : `api/chat/send_message`,
  fetchMessages : (id) => `api/chat/messages/${id}`
}

