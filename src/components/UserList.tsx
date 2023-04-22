import { Heading, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from 'chalkui/dist/cjs/React'
import { Box, Link } from 'chalkui/dist/cjs/Components/Layout'
import { Button } from 'chalkui/dist/cjs/Components/Button'
import React, { ChangeEvent, useEffect, useState } from 'react'
import { useTwitchApi } from '../hooks/UseAPI'
import { useStreamInfo } from '../hooks/UseStreamInfo'
import { Loader } from './Loader'
import { VariableSizeList as List } from 'react-window'
import AutoSizer from "react-virtualized-auto-sizer"
import { Input } from 'chalkui/dist/cjs/Components/Input'
import { FormControl } from 'chalkui/dist/cjs/Components/FormControl'
import '../styles/scrollbar.css'
import { useDispatch } from '../store'
import { AppActions } from '../store/slices/AppSlice'

interface UserListProps {
   isOpen: boolean
   onClose: any
}

export const UserList = ({ isOpen, onClose }: UserListProps) => {
   
   const { chatClient, twitchClient } = useTwitchApi()
   const [chatters, setChatters] = useState<string[]>([])
   const [isSearching, setIsSearching] = useState<boolean>(false)
   const [username, setUsername] = useState<string>('')
   const [results, setResults] = useState<string[]>([])
   
   const dispatch = useDispatch()
   
   const { allViewers, fetchData } = useStreamInfo({ twitchClient, chatClient })
   
   useEffect(() => {
      if (!!allViewers && allViewers.broadcaster && allViewers.moderators && allViewers.vips && allViewers.viewers) {
         setChatters([...allViewers.broadcaster, ...allViewers.moderators, ...allViewers.vips, ...allViewers.viewers])
      }
   }, [allViewers])
   
   function selectUser(username: string) {
      console.log('[UserList]: Selected user: ' + username)
      dispatch(AppActions.selectUser(username))
   }
   
   const Row = ({ index, style }: any) => {
      return <UserItem key={index} style={style} onSelect={() => selectUser(allViewers.viewers[index])}>{allViewers.viewers[index]}</UserItem>
   }
   
   // useEffect(() => {
   //    const electron = window.require('electron')
   //    electron.ipcRenderer.on('refresh-since-user-logged-in', () => {
   //       console.log('fetch data')
   //       fetchData()
   //    })
   // }, [])
   
   const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value
      setUsername(val)
      setIsSearching(val.length > 0)
      const results = chatters?.filter((user, index) => user.includes(val.toLowerCase()))
      setResults(results.slice(0, 50))
   }
   
   function renderViewers(array: string[] | undefined | null) {
      if (array) {
         return (array.length > 0) ?
            array?.map((user: any) => {
               return <UserItem key={user} onSelect={() => selectUser(user)}>{user}</UserItem>
            })
            : <span style={{ fontStyle: 'italic', opacity: '0.5' }}>None</span>
      } else
         return <Loader />
   }
   
   
   return (
      <Modal scrollBehavior="inside" size="sm" isOpen={isOpen} onClose={onClose}>
         <ModalOverlay />
         <ModalContent>
            <ModalHeader>User list</ModalHeader>
            <ModalCloseButton />
            
            <ModalBody className='modview-scrollbar'>
               
               <FormControl my={3}>
                  <Input size="md" type="text" placeholder="Search user" value={username} onChange={onInputChange} />
               </FormControl>
               
               {
                  !isSearching ? (
                     <Box>
                        <ul style={{ listStyle: 'none' }}>
                           {
                              !!allViewers && (
                                 <>
                                    <Heading mb={1} mt={2}>Broadcaster</Heading>
                                    {
                                       renderViewers(allViewers.broadcaster)
                                    }
                                    <Heading mb={1} mt={4}>Moderators</Heading>
                                    {
                                       renderViewers(allViewers.moderators)
                                    }
                                    <Heading mb={1} mt={4}>VIPs</Heading>
                                    {
                                       renderViewers(allViewers.vips)
                                    }
                                    <Heading mb={1} mt={4}>Viewers</Heading>
                                    {
                                       allViewers?.viewers?.length > 0 ?
                                          <AutoSizer>
                                             {({ height, width }) => (
                                                <List
                                                   className="List modview-scrollbar"
                                                   height={300}
                                                   itemCount={allViewers?.viewers?.length}
                                                   itemSize={() => 20}
                                                   width={width}
                                                >
                                                   {Row}
                                                </List>
                                             )}
                                          </AutoSizer>
                                          : <Loader />
                                    }
                                 </>
                              )
                           }
                        </ul>
                     </Box>
                  ) : (
                     <div className={'user-list-content'}>
                        <ul style={{ listStyle: 'none' }}>
                           {
                              (results.length > 0) && results.map((user: any) => {
                                 return <UserItem key={user} onSelect={() => selectUser(user)}>{user}</UserItem>
                              })
                           }
                        </ul>
                     </div>
                  )
               }
            
            </ModalBody>
            
            <ModalFooter>
               <Button variant="basic" onClick={onClose}>Cancel</Button>
            </ModalFooter>
         </ModalContent>
      </Modal>
   )
   
}

export const UserItem = ({ style, children, onSelect }: any) => {
   
   
   return (
      <Box
         as="li"
         onClick={onSelect}
         style={style ?? style}
         sx={{
            cursor: 'pointer',
            _hover: {
               color: 'messenger.400'
            }
         }}
      >{children}</Box>
   )
   
}
