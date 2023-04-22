import axios         from 'axios'
import Debug         from '../helpers/Debug'
import { HelixUser } from 'twitch'
import IvrService    from './IvrService'

const API = axios.create({
   baseURL: `https://api.ivr.fi/twitch/`,
})

export interface SubscriptionProps {
   isSubbed: boolean
   isSubHidden: boolean
   subTier: string
   totalSubMonth: string
   followingSince: string
}

export default {
   
   getSubscription: async (channel: string, username: string): Promise<SubscriptionProps | null> => {
      
      try {
         
         const result = await API.get(`subage/${username}/${channel}`)
         
         if (result) {
            
            return {
               isSubbed: result.data.subscribed,
               isSubHidden: result.data.hidden,
               subTier: result.data.meta.tier,
               totalSubMonth: result.data.cumulative.months,
               followingSince: result.data.followedAt,
            }
            
         } else
            Debug('error', `IVR: Couldn't fetch subscription data`)
         
      } catch (e) {
         Debug('error', `IVR: An error occurred while trying to fetch subscription data`)
      }
      
      return null
      
   },
   
   getSubscriptionStatus: async (user: HelixUser | null | undefined, channel: string | null | undefined) => {
      
      if (user && channel) {
         try {
            const data: SubscriptionProps | null = await IvrService.getSubscription(channel, user.name)
            
            if (data) {
   
               console.log(data)
               
               if (data.isSubbed && data.isSubHidden) {
                  return `Subscriber - Tier ${data.subTier}`
               }
               
               if (data.isSubHidden && !data.isSubbed) {
                  return `Not subscribed`
               } else if (data.isSubbed) {
                  return `Subscriber for ${data.totalSubMonth} months - Tier ${data.subTier}`
               } else if (data.totalSubMonth) {
                  return `Previously subscribed for ${data.totalSubMonth} months`
               } else {
                  return `Not subscribed`
               }
               
            }
            
         } catch (e) {
            Debug('error', `Couldn't fetch subscription data`)
         }
      }
      
      return null
      
      
   },
   
}
