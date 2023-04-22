import { Box, Grid } from 'chalkui/dist/cjs/Components/Layout'
import { ModViewLayout } from '../layout/ModViewLayout'
import { ModViewSidebar } from '../layout/ModViewSidebar'
import { Chat } from '../components/Chat'

export const ModView = () => {
   
   return (
      <ModViewLayout>
         
         <ModViewSidebar />
         
         <Box></Box>
         
         {/*<iframe*/}
         {/*   src="https://player.twitch.tv/?channel=[streamer]&muted=true"*/}
         {/*   height="720"*/}
         {/*   width="100%"*/}
         {/*   // @ts-ignore*/}
         {/*   allowFullScreen="true">*/}
         {/*</iframe>*/}
         
         <Chat />
      
      
      </ModViewLayout>
   )
   
}
