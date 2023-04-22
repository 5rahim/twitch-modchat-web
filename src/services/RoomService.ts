import Debug          from '../helpers/Debug'
import { ChatClient } from 'twitch-chat-client'

export default {
   
   getFollowStatus: (followDelay: number) => {
      if (followDelay === -1) return 'No follow delay'
      if (followDelay > 0) return `Follow delay: ${followDelay}m`
      else return 'Follow'
   },
   
   getSlowStatus: (slowDelay: number) => {
      if (slowDelay === 0) return 'No slow mode'
      if (slowDelay > 0) return `Slow: ${slowDelay}s`
   },
   
   tagExists: (tag: string, msg: any) => {
      try {
         return msg.tags.get(tag) !== undefined
      } catch (e) {
         Debug('error', `Couldn't fetch referenced tag: ${tag}`)
      }
   },
   
   getFollowDelay: (msg: any) => {
      try {
         return Number(msg.tags.get('followers-only'))
      } catch (e) {
         Debug('error', `Couldn't fetch followers-only delay`)
         return false
      }
   },
   
   hasSubsOnly: (msg: any) => {
      try {
         return Number(msg.tags.get('subs-only')) === 1
      } catch (e) {
         Debug('error', `Couldn't fetch subs-only status`)
         return false
      }
   },
   
   getSlow: (msg: any) => {
      try {
         return Number(msg.tags.get('slow'))
      } catch (e) {
         Debug('error', `Couldn't fetch slow mode delay`)
         return false
      }
   },
   
   hasR9k: (msg: any) => {
      try {
         return Number(msg.tags.get('r9k')) === 1
      } catch (e) {
         Debug('error', `Couldn't fetch r9k status`)
         return false
      }
   },
   
   hasEmoteOnly: (msg: any) => {
      try {
         return Number(msg.tags.get('emote-only')) === 1
      } catch (e) {
         Debug('error', `Couldn't fetch emote-only status`)
         return false
      }
   },
   
   changeFollowDelay: (isActive: boolean, chatClient: ChatClient | null, channel: string | null) => {
      if (chatClient && channel) {
         try {
            !isActive ? chatClient.enableFollowersOnly(channel) : chatClient.disableFollowersOnly(channel)
         } catch (e) {
            Debug('error', `Couldn't toggle subs-only mode`)
         }
      } else {
         Debug('error', `chatClient or channel is undefined`)
      }
   },
   
   toggleSubOnly: (isActive: boolean, chatClient: ChatClient | null, channel: string | null) => {
      if (chatClient && channel) {
         try {
            !isActive ? chatClient.enableSubsOnly(channel) : chatClient.disableSubsOnly(channel)
         } catch (e) {
            Debug('error', `Couldn't toggle subs-only mode`)
         }
      } else {
         Debug('error', `chatClient or channel is undefined`)
      }
   },
   
   toggleEmoteOnly: (isActive: boolean, chatClient: ChatClient | null, channel: string | null) => {
      if (chatClient && channel) {
         try {
            !isActive ? chatClient.enableEmoteOnly(channel) : chatClient.disableEmoteOnly(channel)
         } catch (e) {
            Debug('error', `Couldn't toggle emote-only mode`)
         }
      } else {
         Debug('error', `chatClient or channel is undefined`)
      }
   },
   
   toggleR9k: (isActive: boolean, chatClient: ChatClient | null, channel: string | null) => {
      if (chatClient && channel) {
         try {
            !isActive ? chatClient.enableR9k(channel) : chatClient.disableR9k(channel)
         } catch (e) {
            Debug('error', `Couldn't toggle R9k`)
         }
      } else {
         Debug('error', `chatClient or channel is undefined`)
      }
   },
   
   promptFollowDelay: (isActive: boolean, followDelay: number, chatClient: ChatClient | null, channel: string | null) => {
      return (showFollowerModal: any, dispatch: any) => {
         if(followDelay !== undefined) {
            if (followDelay < 0) { // If there isn't a follow delay, allow changing it
               showFollowerModal()
            } else { // When there is a follow delay, disable it
               if (isActive !== null && chatClient && channel) {
                  try {
                     chatClient.disableFollowersOnly(channel)
                     dispatch({ type: 'SET_NEW_FOLLOW_DELAY', time: -1 })
                  } catch (e) {
                     Debug('error', `Couldn't disable followers-only mode`)
                  }
               }
            }
         }
      }
   },
   
   promptSlowDelay: (isActive: boolean, time: number, chatClient: ChatClient | null, channel: string | null) => {
      return (showSlowModal: any, dispatch: any) => {
         if(time !== undefined) {
            if (time === 0) { // If there isn't a slow delay, allow changing it
               showSlowModal()
            } else { // When there is a slow delay, disable it
               if (isActive !== null && chatClient && channel) {
                  try {
                     chatClient.disableSlow(channel)
                     dispatch({ type: 'SET_NEW_SLOW_DELAY', time: 0 })
                  } catch (e) {
                     Debug('error', `Couldn't disable slow mode`)
                  }
               }
            }
         }
      }
   },
   
   enableSlow: (delay: any, currentDelay: any, chatClient: ChatClient | null, channel: string | null) => {
   
      return (hideSlowModal: any) => {
         // Allow changing the slow delay only when there isn't any (slow === 0) and when the time entered is 0 or more
         if (delay !== undefined && currentDelay !== undefined && delay !== 0) {
            if (chatClient && channel) {
               chatClient.enableSlow(channel, delay)
               hideSlowModal()
            }
         }
      }
      
   },
   
   
   enableFollow: (delay: any, currentDelay: any, chatClient: ChatClient | null, channel: string | null) => {
   
      return (hideFollowModal: any) => {
         // Allow changing the follow delay only when there isn't any (followDelay === -1) and when the time entered is 0 or more
         if (delay !== undefined && currentDelay !== undefined && currentDelay < 0 && delay > -1) {
            if (chatClient && channel) {
               chatClient.enableFollowersOnly(channel, delay)
               hideFollowModal()
            }
         }
      }
      
   }
   
}
