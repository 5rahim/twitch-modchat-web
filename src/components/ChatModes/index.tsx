import React, { memo } from 'react'
import { useTwitchApi, UseTwitchApiProps } from '../../hooks/UseAPI'
import { Box } from 'chalkui/dist/cjs/Components/Layout'
import { SidebarPopper } from '../../layout/SidebarPopper'
import { ChatMode } from './ChatMode'
import { BiAlarm, BiBadgeCheck, BiCctv, BiCool } from 'react-icons/all'

export const ChatModes: React.FC<any> = memo(({ isOpen, onClose }) => {
   
   const { chatClient, channel }: UseTwitchApiProps = useTwitchApi()
   
   return (
      <SidebarPopper isOpen={isOpen} onClose={onClose} width="300px">
         <Box p={2} mb={-2}>
            <ul style={{ listStyle: "none" }}>
               {(chatClient && channel) && (
                  <>
                     <ChatMode type={'follow'}>Follow delay</ChatMode>
                     <ChatMode type={'slow'}><BiAlarm /> Slow mode</ChatMode>
                     <ChatMode type={'sub'}><BiBadgeCheck /> Subscriber-only mode</ChatMode>
                     <ChatMode type={'emote'}><BiCool /> Emote-only mode</ChatMode>
                     <ChatMode type={'r9k'}><BiCctv /> R9K</ChatMode>
                  </>
               )}
            </ul>
         </Box>
      </SidebarPopper>
   )
   
})
