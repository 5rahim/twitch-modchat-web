import React, { useEffect, useState } from 'react'
import { useTwitchApi } from '../../hooks/UseAPI'
import { HelixEmoteFromSet, HelixEmoteImageScale } from 'twitch'
import { HelixChatApi } from 'twitch/lib/API/Helix/Chat/HelixChatApi'
import ReactTooltip from 'react-tooltip'
import { useEmoteLists } from '../../hooks/UseEmotes'
import { getEmoteType } from './EmoteSelect'
import { Box } from 'chalkui/dist/cjs/React'
import { useSelector } from '../../store'
import { CredentialSelectors } from '../../store/slices/CredentialSlice'

interface EmoteSelectProps {
   input: any,
   setInput: any,
   chatRef: any,
   show: any
}

const EmoteMenuStyle = {
   position: 'absolute',
   top: '-400px',
   right: '20px',
   width: '300px',
   height: '400px',
   overflow: 'hidden',
   border: '5px solid',
   borderColor: 'gray.700',
   bgColor: 'gray.900',
   overflowY: 'auto',
   borderRadius: 5,
   textAlign: 'center',
   pt: 2,
   pb: 5,
   '& > * > ul, & > ul': {
      display: 'flex',
      flexWrap: 'wrap',
      listStyle: 'none',
      margin: 0,
      borderRadius: 5,
      justifyContent: 'center',
      p: 2,
   },
   '& > * > ul > li, & > ul > li': {
      height: '34px',
      borderRadius: 5,
      justifyContent: 'center',
      alignItems: 'center',
      p: '.1rem',
      transition: 'all .1s linear',
      cursor: 'pointer',
   },
   '& > * > ul > li:hover, & > ul > li:hover': {
      transform: 'scale(1.4)',
   },
   '& > .chat-emote-menu-title': {
      width: '100%',
      textAlign: 'center',
      fontWeight: 'bold',
   },
   '& > .chat-emote-hint': {
      position: 'fixed',
      width: '300px',
      mt: '348px',
      right: '20px',
      textAlign: 'center',
      p: '.5rem 0',
      fontSize: '17px',
      zIndex: 2,
      bgColor: 'gray.700',
   },
}

const Emote = React.memo(({ data, style, autocomplete, hint }: { data: any, style?: any, autocomplete: any, hint: any }) => {
   return (
      <li onMouseEnter={() => hint(data.code)} onMouseLeave={() => hint(null)}>
         <img
            data-for={data.id}
            data-tip={data.code}
            data-iscapture="true"
            src={data.img}
            style={style}
            onClick={() => autocomplete(data.code)} />
         {/*<ReactTooltip id={data.id} type="dark" effect="float" />*/}
      </li>
   )
})


export const EmoteMenu = ({ input, setInput, chatRef, show }: EmoteSelectProps) => {
   
   const { chatClient, twitchClient } = useTwitchApi()
   
   const credentials = useSelector(CredentialSelectors.credentials)
   
   const [channelID, setChannelID] = useState<any>(null)
   
   
   const [channelEmotes, setChannelEmotes] = useState<any[]>([])
   const [otherChannelEmotes, setOtherChannelEmotes] = useState<any[]>([])
   const [thirdPartyEmotes, setThirdPartyEmotes] = useState<any[]>([])
   const [globalEmotes, setGlobalEmotes] = useState<any[]>([])
   const [tpGlobalEmotes, setTPGlobalEmotes] = useState<any[]>([])
   
   const {
      userEmotes,
      bttvGlobalEmotes,
      bttvUserEmotes,
      ffzGlobalEmotes,
      ffzUserEmotes,
   } = useEmoteLists()
   
   useEffect(() => {
      console.log('id', channelID)
   }, [channelID])
   
   useEffect(() => {
      async function fetch() {
         if (credentials.channel && twitchClient) {
            console.log('FECTHING CHANNEL USER ID')
            try {
               const channelUser = await (twitchClient as any)?.helix?.users?.getUserByName(credentials.channel)
               setChannelID(channelUser.id)
               console.log('FETCHED CHANNEL USER ID', channelUser.id)
            } catch (e) {
               console.log(e)
            }
           
         }
      }
      
      fetch()
   }, [credentials.channel, chatClient, twitchClient])
   
   
   useEffect(() => {
      
      async function fetch() {
         if (channelID) {
            
            console.log('Fetching other channel emotes')
            
            let otherChannelList: any[] = []
            let ownerNames: { id: any, name: string }[] = []
            
            for (const [key, value] of Object.entries(userEmotes)) {
               // @ts-ignore
               if (getEmoteType(value) === 'user' && value.ownerId != channelID && value.emoteSetId != 0) {
                  let ownerName = ''
                  const checkNameArr = ownerNames.filter((e) => e.id === value.ownerId)
                  if (checkNameArr.length > 0) {
                     // @ts-ignore
                     ownerName = checkNameArr[0].name
                  } else {
                     const user = await value.getOwner()
                     ownerName = await user?.name || 'undefined'
                     ownerNames.push({ id: value.ownerId, name: ownerName })
                  }
                  // @ts-ignore
                  otherChannelList.push({ id: key, code: value.name, img: `https://static-cdn.jtvnw.net/emoticons/v2/${value.id}/default/dark/1.0`, ownerId: ownerName })
                  
               }
            }
            
            otherChannelList.sort(function (a, b) {
               return ('' + a.ownerId).localeCompare(b.ownerId)
            })
            
            
            otherChannelList = otherChannelList.reduce((acc, item) => {
               if (!acc[item.ownerId]) {
                  acc[item.ownerId] = []
               }
               
               
               acc[item.ownerId].push(item)
               return acc
            }, {})
            
            setOtherChannelEmotes(otherChannelList)
            
         }
      }
      
      fetch()
      
      
   }, [userEmotes, channelID])
   
   useEffect(() => {
      
      async function fetch() {
         
         if (userEmotes && channelID) {
            
            console.log('Fetching channel emotes')
            
            let channelList: any[] = []
            
            let globalList: any[] = []
            
            
            for (const [key, value] of Object.entries(userEmotes)) {
               
               // @ts-ignore
               if (getEmoteType(value) === 'user' && (value.ownerId && value.ownerId == channelID)) {
                  // @ts-ignore
                  channelList.push({ id: key, code: value.name, img: `https://static-cdn.jtvnw.net/emoticons/v2/${value.id}/default/dark/1.0` })
                  setChannelEmotes([...channelList])
                  
               }
               
               // @ts-ignore
               if (getEmoteType(value) === 'user' && value.emoteSetId == 0) {
                  // @ts-ignore
                  globalList.push({ id: key, code: value.name, img: `https://static-cdn.jtvnw.net/emoticons/v2/${value.id}/default/dark/1.0` })
                  
               }
               
            }
            
            setTPGlobalEmotes(globalList)
            
         }
      }
      
      fetch()
      
   }, [userEmotes, channelID])
   
   
   useEffect(() => {
      
      let thirdPartyList: any[] = []
      
      for (const [key, value] of Object.entries({ ...bttvUserEmotes, ...ffzUserEmotes })) {
         
         if (getEmoteType(value) === 'third-party') {
            // @ts-ignore
            thirdPartyList.push({ id: key, code: key, img: value.imageUrl })
         }
      }
      
      setThirdPartyEmotes(thirdPartyList)
      
   }, [bttvUserEmotes, ffzUserEmotes])
   
   
   useEffect(() => {
      
      let globalList: any[] = []
      
      for (const [key, value] of Object.entries({ ...bttvGlobalEmotes, ...ffzGlobalEmotes })) {
         
         if (getEmoteType(value) === 'third-party') {
            // @ts-ignore
            globalList.push({ id: key, code: key, img: value.imageUrl })
         }
         
      }
      
      setGlobalEmotes(globalList)
      
   }, [bttvGlobalEmotes, ffzGlobalEmotes])
   
   
   function autocomplete(code: string) {
      const arr = input.split(' ')
      arr[arr.length] = code
      setInput(arr.join(' ') + ' ')
      chatRef.current.focus()
   }
   
   const [hintText, setHintText] = useState<string | null>(null)
   
   function hint(code: string | null) {
      setHintText(code)
   }
   
   return (
      <>
         
         {show && (
            <Box
               className="modview-scrollbar"
               sx={EmoteMenuStyle}
            >
               
               {hintText && <div className="chat-emote-hint">{hintText}</div>}
               
               <div className="chat-emote-menu-title">Channel emotes</div>
               <ul>
                  {(channelEmotes.length > 0 && channelEmotes?.map((emote: any) => {
                     return (
                        <Emote key={emote.id} hint={hint} style={{ width: '28px', height: '28px' }} data={emote} autocomplete={autocomplete} />
                     )
                  }))}
               </ul>
               {
                  Object.keys(otherChannelEmotes).map((key: any, index) => {
                        return (
                           <div key={key}>
                              <div className="chat-emote-menu-title">{key}</div>
                              <ul>
                                 {(otherChannelEmotes[key]?.length > 0 && otherChannelEmotes[key]?.map((emote: any) => {
                                    return (
                                       <Emote key={emote.id} hint={hint} style={{ width: '28px', height: '28px' }} data={emote} autocomplete={autocomplete} />
                                    )
                                 }))}
                              </ul>
                           </div>
                        )
                     },
                  )
               }
               
               <div className="chat-emote-menu-title">BTTV & FFZ emotes</div>
               <ul>
                  {(thirdPartyEmotes.length > 0 && thirdPartyEmotes?.map((emote: any) => {
                     return (
                        <Emote key={emote.id} hint={hint} style={{ width: 'auto' }} data={emote} autocomplete={autocomplete} />
                     
                     )
                  }))}
               </ul>
               <div className="chat-emote-menu-title">Global emotes</div>
               <ul>
                  {(globalEmotes.length > 0 && globalEmotes?.map((emote: any) => {
                     return (
                        <Emote key={emote.id} hint={hint} style={{ width: 'auto' }} data={emote} autocomplete={autocomplete} />
                     )
                  }))}
                  {(tpGlobalEmotes.length > 0 && tpGlobalEmotes?.map((emote: any) => {
                     return (
                        <Emote key={emote.id} hint={hint} style={{ width: 'auto' }} data={emote} autocomplete={autocomplete} />
                     )
                  }))}
               </ul>
            </Box>
         )}
      
      </>
   )
   
}
