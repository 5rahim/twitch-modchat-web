import React, { RefObject, useEffect, useState } from 'react'
import { useEmotes } from '../../hooks/UseEmotes'
import { ThirdPartyEmote } from '../../models/ThirdPartyEmote'
import { HelixEmoteFromSet, HelixEmoteImageScale } from 'twitch'
import useDynamicRefs from 'use-dynamic-refs'
import { Box } from 'chalkui/dist/cjs/Components/Layout'


interface EmoteSelectProps {
   input: any,
   setInput: any,
   chatRef: any,
   currentWord: string
}

export function getEmoteType(emote: any) {
   if (emote.hasOwnProperty('imageUrl')) return 'third-party'
   else return 'user'
}

export const EmoteSelect = ({ input, setInput, chatRef, currentWord }: EmoteSelectProps) => {
   
   const emotes = useEmotes()
   
   const [formattedEmotes, setFormattedEmotes] = useState<any[]>([])
   
   const [showEmoteList, setShowEmoteList] = useState<boolean>(false)
   const [emoteAutocompletion, setEmoteAutocompletion] = useState<string | null>(null)
   const [emoteAutocompletionResults, setEmoteAutocompletionResults] = useState<any>(null)
   
   const [highlightedItem, setHighlightedItem] = useState<any>(null)
   
   const [getRef, setRef] = useDynamicRefs()
   
   
   useEffect(() => {
      
      /** Check for emote autocompletion */
      if (currentWord && currentWord[0] === ':') {
         setShowEmoteList(true)
         const t = !!currentWord.replace(':', '') ? currentWord.replace(':', '') : '&&&'
         setEmoteAutocompletion(t)
      } else {
         setShowEmoteList(false)
         setEmoteAutocompletion(null)
      }
      
      if(currentWord && currentWord[0] != ':') {
         setEmoteAutocompletion('&&&')
      }
      
   }, [currentWord])
   
   /**
    * Format emotes
    */
   useEffect(() => {
      
      let list: any[] = []
      
      for (const [key, value] of Object.entries(emotes)) {
         
         if (getEmoteType(value) === 'third-party') {
            // @ts-ignore
            list.push({ id: key, code: key, img: value.imageUrl })
            
         } else {
            // @ts-ignore
            list.push({ id: key, code: value.name, img: value.getImageUrl(1 as HelixEmoteImageScale) })
            
         }
      }
      
      // Sort
      list.sort(function (a, b) {
         return a.code.length - b.code.length
      })
      
      setFormattedEmotes(list)
      
      
   }, [emotes])
   
   /**
    * Emote autocompletion
    */
   useEffect(() => {
      setHighlightedItem(null)
      
      if (emoteAutocompletion) {
         
         const results =
            emoteAutocompletion === '&&&' ?
               formattedEmotes :
               formattedEmotes?.filter((emote, index) => emote.code.toLowerCase().includes(emoteAutocompletion.toLowerCase()))
         setEmoteAutocompletionResults(results)
         
      }
   }, [emoteAutocompletion])
   
   
   /**
    * Autocomplete on Enter
    * @param {any} key
    */
   function downHandler({ key }: any) {
      
      if ((key === 'Enter' || key === 'Tab') && emoteAutocompletion != '&&&' && emoteAutocompletionResults && currentWord.length > 0) {
         emoteAutocompletionResults[0] && autocompleteEmoteAutocompletion(emoteAutocompletionResults[highlightedItem].code)
      }
      
      if(key === 'Tab' && emoteAutocompletion == '&&&' && formattedEmotes) {
         setEmoteAutocompletion(currentWord)
         const emoteArr = formattedEmotes.filter((emote: any, index: number) => emote.code.toLowerCase().includes(currentWord.toLowerCase()))
         // if(emoteArr.length > 0) {
         //    const arr = input.split(' ')
         //    arr[arr.length - 1] = emoteArr[0].code
         //    setInput(arr.join(' '))
         // }
         setEmoteAutocompletionResults(emoteArr)
         setShowEmoteList(true)
         
         setTimeout(() => {
            chatRef.current.focus()
            setEmoteAutocompletion(null)
         }, 200)
      }
      
      if (key === 'ArrowUp' && highlightedItem != null && emoteAutocompletionResults) {
         const newIndex = highlightedItem - 1
         if (newIndex >= 0) {
            setHighlightedItem(newIndex)
         }
      }
      if (key === 'ArrowDown' && highlightedItem != null && emoteAutocompletionResults) {
         const newIndex = highlightedItem + 1
         if (newIndex <= emoteAutocompletionResults.length - 1) {
            setHighlightedItem(newIndex)
         }
      }
      
   }
   
   useEffect(() => {
      if (highlightedItem) {
         ((getRef('ul') as any)?.current as any)!.scrollTop = (getRef(highlightedItem?.toString())?.current as any).offsetTop - 80
      } else {
         (getRef('ul')?.current as any)!.scrollTop = 0
      }
   }, [emoteAutocompletionResults, highlightedItem])
   
   
   useEffect(() => {
      window.addEventListener("keydown", downHandler)
      
      return () => {
         window.removeEventListener("keydown", downHandler)
      }
   })
   
   useEffect(() => {
      if (emoteAutocompletionResults) {
         if (!highlightedItem) {
            setHighlightedItem(emoteAutocompletionResults.indexOf(emoteAutocompletionResults[0]))
         }
      }
   }, [emoteAutocompletionResults, highlightedItem])
   
   function autocompleteEmoteAutocompletion(code: string) {
      const arr = input.split(' ')
      arr[arr.length - 1] = code
      setInput(arr.join(' ') + ' ')
      chatRef.current.focus()
      setShowEmoteList(false)
      setEmoteAutocompletionResults(null)
      setEmoteAutocompletion(null)
      setTimeout(() => {
         chatRef.current.focus()
      }, 200)
   }
   
   return (
      <>
         
         {showEmoteList && (
            <Box
               position="absolute"
               top="-180px"
               left={0}
               right={0}
               width="250px"
               height="180px"
               overflow="hidden"
               sx={{
                  '& > ul': {
                     m: 0,
                     p: 0,
                     overflowY: 'auto',
                     height: '100%',
                     border: '5px #272727 solid',
                     bgColor: 'gray.900',
                     borderRadius: 5,
                     listStyle: 'none'
                  },
                  '& > ul > li': {
                     p: 1
                  }
               }}
            >
               
               <Box as="ul" className="modview-scrollbar" ref={setRef('ul') as RefObject<any>}>
                  {
                     ((emoteAutocompletionResults && emoteAutocompletionResults?.length > 0) &&
                        emoteAutocompletionResults?.map((emote: any, index: number) => {
                           return (
                              <li
                                 key={emote.id}
                                 ref={setRef(index.toString()) as RefObject<any>}
                                 style={{ padding: '.2rem .5rem' }}
                                 onClick={() => autocompleteEmoteAutocompletion(emote.code)}
                                 className={highlightedItem === index ? `selected` : ``}
                              >
                                 <img src={emote.img} style={{ width: 'auto', height: '20px' }} /> - {emote.code}
                              </li>
                           )
                        }))
                  }
               </Box>
            </Box>
         )}
      
      </>
   )
   
}
