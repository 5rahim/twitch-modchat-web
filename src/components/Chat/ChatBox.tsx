import TextareaAutosize from 'react-textarea-autosize'
import React, { ChangeEvent, memo, useEffect, useRef, useState } from 'react'
import { BiSmile } from 'react-icons/all'
import { useStreamInfo } from '../../hooks/UseStreamInfo'
import { useTwitchApi } from '../../hooks/UseAPI'
import { Box } from 'chalkui/dist/cjs/Components/Layout'
import { EmoteMenu } from './EmoteMenu'

export const ChatBox = memo(() => {
   
   const [value, setChatValue] = useState<string>('')
   const [currentWord, setCurrentWord] = useState<string>('')
   const [showEmoteMenu, setShowEmoteMenu] = useState(true)
   
   const { chatClient, twitchClient, channel, channelID } = useTwitchApi()
   const { allViewers, fetchData } = useStreamInfo({ twitchClient, chatClient })
   const [chatters, setChatters] = useState<string[]>([])
   const textareaRef = useRef<any>(null)
   
   useEffect(() => {
      if (!!allViewers && allViewers.broadcaster && allViewers.moderators && allViewers.vips && allViewers.viewers) {
         setChatters([...allViewers.broadcaster, ...allViewers.moderators, ...allViewers.vips, ...allViewers.viewers])
      }
   }, [allViewers])
   
   
   // ------------------------------------------------------------------------------------------------------------------
   
   function handleValueChange(e: ChangeEvent<HTMLTextAreaElement>) {
      setChatValue(e.target.value)
   }
   
   function handleKeyPress(e: any) {
      if (e.key === 'Enter') {
         e.preventDefault()
      }
   }
   
   // function handleKeyDown(e: any) {
   //    console.log(e.keyCode)
   //    if (e.keyCode === 38 && e.keyCode === 40) {
   //       e.preventDefault()
   //    }
   // }
   
   
   function handleKeyUp(e: any) {
      const text = e.target.value.split(' ')
      setCurrentWord(text[text.length - 1])
   }
   
   
   return (
      <>
         
         <Box
            position="relative"
            maxHeight="100vh"
         >
            
            <EmoteMenu input={value} setInput={setChatValue} chatRef={textareaRef} show={showEmoteMenu} />
            
            {/*<UsernameMenu input={value} setInput={setChatValue} chatRef={textareaRef} chatters={chatters} currentWord={currentWord} />*/}
            
            {/*<EmoteSelect input={value} setInput={setChatValue} chatRef={textareaRef} currentWord={currentWord} />*/}
            
            <Box
               style={{ margin: 0 }}
               sx={{
                  position: 'relative',
                  backgroundColor: 'gray.800',
                  px: 3,
                  py: 2,
                  pr: '2rem',
                  '& > textarea': {
                     resize: 'none',
                     width: '100%',
                     bgColor: 'transparent',
                     fontFamily: '"Nunito Sans", sans-serif !important',
                     outline: 0,
                  }
               }}
            >
               <TextareaAutosize
                  ref={textareaRef}
                  maxRows={7}
                  placeholder={'Send a message'}
                  value={value}
                  onChange={handleValueChange}
                  onKeyUp={handleKeyUp}
                  onKeyPress={handleKeyPress}
                  // onKeyDown={handleKeyDown}
               />
            </Box>
            
            <Box
               position="absolute"
               top={0}
               right={0}
            >
               <div className="chat-action-character-count">
                  {value.replaceAll(' ', '').length > 0 ? value.replaceAll(' ', '').length : ''}
               </div>
               <div className="chat-action-emotes" onClick={() => setShowEmoteMenu(o => !o)}>
                  <BiSmile />
               </div>
            </Box>
         </Box>
      
      </>
   )
   
})
