import { ChatBadge } from './ChatBadge'
import { ChatEmote, ChatEmotePlacement } from './ChatEmote'
import { ChatMessageUser } from './ChatMessageUser'
import { TwitchPrivateMessage } from 'twitch-chat-client/lib/StandardCommands/TwitchPrivateMessage'
import { Settings } from '../store/states/Types'

const isActionRegex = /^\u0001ACTION (.*)\u0001$/

type MessageBuilderType = "user-message" | "user-backlog-message"
type MessageType = "user-message" | "mod-action"


interface UserMessage {
   id: string | undefined
   badges: ChatBadge[]
   emotes: ChatEmote[]
   isAction: boolean | undefined
   isModdable: boolean | undefined
   content: string | undefined
   user: ChatMessageUser | undefined
   isBacklog: boolean
   ircBadges: string | undefined
   ircEmotes: string | undefined
   highlight: {
      isHighlighted: boolean
      color: string | undefined
      flash: boolean
   },
   autopilot: {
      flagged: boolean
      timeout: string | undefined
   }
}

export class ChatMessage {
   
   type: MessageType = "user-message"
   createdAt = Date.now()
   
   userMessage: UserMessage = {
      id: "",
      badges: [],
      emotes: [],
      isAction: false,
      isModdable: undefined,
      content: undefined,
      user: undefined,
      isBacklog: false,
      ircBadges: undefined,
      ircEmotes: undefined,
      highlight: {
         isHighlighted: false,
         color: undefined,
         flash: false,
      },
      autopilot: {
         flagged: false,
         timeout: undefined
      },
   }
   
   constructor(
      messageBuilderType: MessageBuilderType,
      public readonly data: any,
      settings: Settings,
   ) {
      
      switch (messageBuilderType) {
         case 'user-message':
            const i = data as TwitchPrivateMessage
            this.buildMessage(
               settings,
               i.id,
               i.message.value,
               !(i.userInfo.isMod || i.userInfo.isBroadcaster),
               i.tags.get('badges'),
               i.tags.get('emotes'),
               { id: i.userInfo.userId, username: i.userInfo.userName, displayName: i.userInfo.displayName, color: i.userInfo.color },
            )
            return
         case 'user-backlog-message':
            this.buildMessage(
               settings,
               data.user.id,
               data.message,
               !(data.user.mod || data.user.username == data.channel),
               data.user['badges-raw'],
               data.user['emotes-raw'],
               { id: data.user['user-id'], username: data.user.username, displayName: data.user['display-name'], color: data.user.color },
               data.at,
               true,
            )
            return
         default:
            return
      }
      
   }
   
   /**
    * User message
    * @param {string} id
    * @param {string} content
    * @param {boolean} isModdable
    * @param {string | undefined} ircBadges
    * @param {string | undefined} ircEmotes
    * @param {{id: string | undefined, username: string | undefined, displayName: string | undefined, color: string | undefined}} userInfo
    * @param createdAt
    * @param {boolean} isBacklog
    * @private
    */
   
   private buildMessage(
      settings: Settings,
      id: string,
      content: string,
      isModdable: boolean,
      ircBadges: string | undefined,
      ircEmotes: string | undefined,
      userInfo: { id: string | undefined, username: string | undefined, displayName: string | undefined, color: string | undefined },
      createdAt?: any,
      isBacklog?: boolean,
   ) {
      this.type = "user-message"
      if (createdAt) this.createdAt = createdAt
      
      this.userMessage.ircBadges = ircBadges
      this.userMessage.ircEmotes = ircEmotes
      this.userMessage.id = id
      this.userMessage.content = content
      this.userMessage.isModdable = isModdable
      this.userMessage.isBacklog = isBacklog || false
      
      
      const actionMatch = content.match(isActionRegex)
      if (actionMatch) {
         this.userMessage.content = actionMatch[1]
         this.userMessage.isAction = true
      }
      
      this.userMessage.user = new ChatMessageUser(userInfo.id || "", userInfo.username || "", userInfo.displayName || "", userInfo.color || "#666")
      
      this.parseBadges()
      this.parseEmotes()
      this.parseHighlight(settings)
      
   }
   
   /**
    * Get Highlight Infos
    * @param {Settings} settings
    * @private
    */
   private parseHighlight(settings: Settings) {
      
      /**
       * Username
       */
      const username = this.userMessage.user?.username
      const highlightUserList = settings.highlighting.users
      if (username && highlightUserList) {
         for (const u of highlightUserList) {
            if (username.toLowerCase() === u.name.toLowerCase() && !u.hide) {
               this.userMessage.highlight = {
                  isHighlighted: true,
                  color: u.color,
                  flash: u.flash,
               }
            }
         }
      }
      
      /**
       * Message
       */
      const message = this.userMessage.content
      
      const highlightMessageList = settings.highlighting.messages
      if (message && highlightMessageList) {
         for (const m of highlightMessageList) {
            
            if (!m.hide) {
               // Normal
               if (!m.regex) {
                  
                  const flags = m.caseSensitive ? 'g' : 'gi'
                  const match = new RegExp(`\\b${m.pattern}\\b`, flags)
                  
                  if (match.test(message)) {
                     this.userMessage.highlight = {
                        isHighlighted: true,
                        color: m.color,
                        flash: m.flash,
                     }
                  }
               }
               //Regex
               else {
                  
                  const flags = m.caseSensitive ? 'g' : 'gi'
                  const match = new RegExp(m.pattern, flags)
                  if (match.test(message)) {
                     this.userMessage.highlight = {
                        isHighlighted: true,
                        color: m.color,
                        flash: m.flash,
                     }
                  }
                  
               }
            }
         }
      }
      
      // const autopilotData = {
      //    isOn: settings.moderation.autopilot.isOn,
      //    timeout: settings.moderation.autopilot.timeout,
      //    isCaseSensitive: settings.moderation.autopilot.isCaseSensitive,
      //    isRegex: settings.moderation.autopilot.isRegex,
      //    patterns: settings.moderation.autopilot.patterns,
      // }
      // if (message && autopilotData.patterns && autopilotData.isOn) {
      //    for (const m of autopilotData.patterns) {
      //
      //       const flags = autopilotData.isCaseSensitive ? 'g' : 'gi'
      //
      //       if (!autopilotData.isRegex) {
      //
      //          const match = new RegExp(`\\b${m}\\b`, flags)
      //
      //          if (match.test(message)) {
      //             this.userMessage.autopilot = {
      //                timeout: autopilotData.timeout,
      //                flagged: true
      //             }
      //          }
      //       }
      //       //Regex
      //       else {
      //
      //          const match = new RegExp(m, flags)
      //          if (match.test(message)) {
      //             this.userMessage.autopilot = {
      //                timeout: autopilotData.timeout,
      //                flagged: true
      //             }
      //          }
      //
      //       }
      //
      //    }
      // }
      
   }
   
   public triggerHighlights() {
      if (this.userMessage.highlight.flash) {
         // Play sound & flash windows bar
      }
   }
   
   /**
    * Get Badges
    * @private
    */
   private parseBadges() {
      const badgeSpl = (this.userMessage.ircBadges || "").split(",")
      
      for (let i = 0; i < badgeSpl.length; ++i) {
         const [name, version] = badgeSpl[i].split("/")
         if (!(name && version)) continue
         this.userMessage.badges.push(new ChatBadge(name, version))
      }
   }
   
   /**
    * Get Emotes
    * @private
    */
   private parseEmotes() {
      const emotesSpl = (this.userMessage.ircEmotes || "").split("/")
      
      for (let i = 0; i < emotesSpl.length; ++i) {
         const [emoteID, placementStr] = emotesSpl[i].split(":")
         if (!(emoteID && placementStr)) continue
         
         const placements: ChatEmotePlacement[] = []
         const placementSpl = placementStr.split(",")
         for (let i = 0; i < placementSpl.length; ++i) {
            const [startStr, endStr] = placementSpl[i].split("-")
            if (!(startStr && endStr)) continue
            const start = parseInt(startStr)
            const end = parseInt(endStr)
            if (isNaN(start) || isNaN(end)) continue
            placements.push(new ChatEmotePlacement(start, end))
         }
         
         placements.length &&
         this.userMessage.emotes.push(new ChatEmote(emoteID, placements))
      }
   }
   
}
