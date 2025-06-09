import { BodyUpdateProfile, User } from 'src/types/user.type'
import { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/http'

const userApi = {
  getProfile() {
    return http.get<SuccessResponse<User>>('me')
  },
  updateProfile(body: BodyUpdateProfile) {
    return http.put<SuccessResponse<User>>('user', body)
  }
}

export default userApi
