import { ThirdPartyEmotesProvider } from '../../contexts/third-party-emotes'
import AutoSizer from 'react-virtualized-auto-sizer'
import { Box, Flex } from 'chalkui/dist/cjs/Components/Layout'
import { useTwitchApi } from '../../hooks/UseAPI'
import { ChatRoot } from './ChatRoot'
import { ChatBox } from './ChatBox'
import { useEffect } from 'react'


export const Chat = () => {
   
   const { chatClient, twitchClient, channelID } = useTwitchApi()
   
   useEffect(() => {
      console.log(channelID)
   }, [channelID])
   
   return (
      <ThirdPartyEmotesProvider channelId={channelID}>
         <Flex
            maxHeight="100vh"
            flexDirection="column"
         >
            
            <Box
               flexGrow={1}
               // height="calc(100vh - 65px)"
            >
               <AutoSizer>
                  {({ height, width }) => (
                     <ChatRoot height={height} width={width} />
                  )}
               </AutoSizer>
            </Box>
            
            <ChatBox />
         
         
         </Flex>
      </ThirdPartyEmotesProvider>
   )
   
}
