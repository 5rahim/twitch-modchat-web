import axios from 'axios'


const API = axios.create({
   baseURL: 'https://backlog.gettc.xyz/v1',
})


export default {
   
   getBacklog: async (channel: string, before = Date.now(), after = 0, limit = 200) => {
      
      try {
         
         const result = await API.get(`${channel}`, {
            params: {
               before, after, limit,
            },
         })
         
         if (result)
            return result
         
         
      } catch (e) {
      
      }
      
   },
   
}
