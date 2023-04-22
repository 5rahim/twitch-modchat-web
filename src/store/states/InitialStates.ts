import { Settings } from './Types'

export const InitialAppStates = {
   needLogin: null,
   credentials: null,
   twitchClient: null,
   chatClient: null,
   selectedUser: null,
   showSettingsWindow: false,
   bookmarks: null,
   watchlist: null
}

export const InitialSettings: Settings = {
   appearance: {
      messages: {
         stickAtMessage: true,
         separateWithLines: false,
         alternateBackground: false,
         boldUsername: false,
         showTimestamp: false,
         redeemedHighlight: false,
      },
      showPopupProfile: false
   },
   highlighting: {
      users: [
         {
            name: "[myusername]",
            color: "#7f3f49",
            flash: false,
            hide: false,
         },
         {
            name: "[streamer]",
            color: "#7f3f49",
            flash: true,
            hide: false,
         },
      ],
      messages: [
         {
            pattern: "mods",
            color: "#1c8d75",
            flash: false,
            caseSensitive: false,
            regex: false,
            hide: false,
         },
      ],
   },
   commands: [
      {
         name: "union",
         func: "{1} ￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼ {2}",
      },
   ],
   moderation: {
      stickAutomodMessage: true,
      bodyguard: {
         minimumProbability: .5,
         identityAttack: false,
         insult: false,
         obscene: false,
         severeToxicity: false,
         explicit: false,
         threat: false,
         toxicity: false
      },
      quickMode: false,
      assistant: {
         isOn: false,
         patterns: [
         
         ],
      },
      timeouts: ['1s', '30s', '1m', '5m', '10m', '30m', '1h', '3h', '8h', '1d', '3d', '1w', '2w'],
      nukes: [
      
      ],
      games: ['Just Chatting', "Grand Theft Auto V"],
   },
}
