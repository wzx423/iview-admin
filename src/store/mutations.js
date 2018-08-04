'use strict'
import {
  RECORD_USERINFO,
  SET_TOKEM
} from './mutation-type.js'

export default {
  [RECORD_USERINFO] (state, data) {
    state.userInfo = data
  },
  [SET_TOKEM] (state, data) {
    state.token = data
  }
}
