import { ApiClient }          from 'twitch'
import { StaticAuthProvider } from 'twitch-auth'
import { ChatClient }         from 'twitch-chat-client'
import CLIENT_ID              from '../constants/client-id'
import Debug                  from '../helpers/Debug'
import { Credentials }        from '../store/states/Types'

enum ConnectionState {
   Connected,
   Connecting,
   Disconnected,
}

const MAX_RECONNECT_TIMEOUT = 10 * 1000

export class TwitchConnection {
   
   private twitchClient: any
   private chatClient: any
   private credentials: Credentials
   private forceDisconnect = false
   private state = ConnectionState.Disconnected
   private connectionAttempts = 0
   private connectionTimeout?: NodeJS.Timer
   
   private messageCallback?: any
   
   
   constructor(credentials: Credentials) {
      this.credentials = credentials
   }
   
   public connect() {
      
      if (this.forceDisconnect) return
      // Do not try to connect the client if the connection is there
      if (this.state !== ConnectionState.Disconnected) return
      
      ++this.connectionAttempts
      
      this.state = ConnectionState.Connecting
      // Give 5s to connect
      this.connectionTimeout = setTimeout(
         () => this.handleDisconnect(),
         5000,
      )
      
      
      try {
         const authProvider = new StaticAuthProvider(CLIENT_ID, this.credentials.token,
            [
               'channel:read:subscriptions',
               'chat:read',
               'chat:edit',
               'channel:moderate',
               'channel:read:redemptions',
               'user:read:blocked_users',
               'user:manage:blocked_users',
               'user:read:broadcast',
               'user:edit:broadcast',
               'user:edit:follows',
               'user:read:email',
               'moderation:read',
               'user:edit',
               'whispers:read',
               'whispers:edit',
               'analytics:read:games',
            ])
         
         // Establish the connection to chat
         this.chatClient = new ChatClient(authProvider, { channels: [this.credentials.channel] })
         
         // Establish the connection to twitch
         this.twitchClient = new ApiClient({ authProvider })
         
         this.chatClient.connect().then(() => {
            
            console.log("[TwitchConnection]: Chat Client initialized")
            this.connectionTimeout && clearTimeout(this.connectionTimeout)
            
         })
         
         
      } catch (e) {
         Debug('error', e)
      }
      
   }
   
   public getChatClient() {
      return this.chatClient
   }
   
   public getTwitchClient() {
      return this.twitchClient
   }
   
   public onMessage(cb: any): void {
      this.messageCallback = cb
   }
   
   public disconnect(): void {
      this.forceDisconnect = true
      this.chatClient && this.chatClient.quit()
   }
   
   private handleDisconnect() {
      // Prevent duplicate reconnection attempts
      if (this.state === ConnectionState.Disconnected) return
      this.state = ConnectionState.Disconnected
      
      // Close the connection
      this.chatClient && this.chatClient.quit()
      
      console.log("Disconnected from Twitch.")
      
      setTimeout(
         () => this.connect(),
         Math.min(this.connectionAttempts * 2000, MAX_RECONNECT_TIMEOUT),
      )
   }
   
}
