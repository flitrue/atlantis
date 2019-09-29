import store from '@/store'
import _ from 'lodash'

export { default } from './GroupSelect'

export function getGroupNameByCode(groupCode) {
  const allGroupCodes = store.state.basic.allGroupCodes
  const group = _.find(allGroupCodes, { groupCode }) || {}
  return group.groupName
}
