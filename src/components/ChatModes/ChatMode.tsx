import React, { memo, useCallback, useEffect, useMemo, useReducer, useState } from 'react'
import produce from 'immer'
import { useForm } from 'react-hook-form'
import { useModal } from 'react-modal-hook'
// import { TimeModal } from './TimeModal'
import { BiAlarm } from 'react-icons/all'
import RoomService from '../../services/RoomService'
import { UseTwitchApiProps, useTwitchApi } from '../../hooks/UseAPI'
import { Box, Flex } from 'chalkui/dist/cjs/Components/Layout'
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from 'chalkui/dist/cjs/React'
import { Switch } from '../UI/Switch'
import { SettingsActions, SettingsKeys } from '../../store/slices/SettingsSlice'
import { HorizontalLine } from '../UI/HorizontalLine'
import { ItemCreationForm } from '../Cell/ItemCreationForm'
import { Cell } from '../Cell'
import { Button } from 'chalkui/dist/cjs/Components/Button'
import { FormControl } from 'chalkui/dist/cjs/Components/FormControl'
import { Input } from 'chalkui/dist/cjs/Components/Input'

interface ChatModeProps {
   children: React.ReactNode
   type: string
   initialState?: boolean
}

export const ChatModesReducer = (state: any, action: any) => {
   switch (action.type) {
      case 'SET_CURRENT_MSG':
         state.currentMsg = action.msg
         return
      case 'SET_IS_ACTIVE':
         state.isActive = action.isActive
         return
      case 'SET_FOLLOW_DELAY':
         state.follow = action.time
         return
      case 'SET_NEW_FOLLOW_DELAY':
         state.newFollow = action.time
         return
      case 'SET_SLOW_DELAY':
         state.slow = action.time
         return
      case 'SET_NEW_SLOW_DELAY':
         state.newSlow = action.time
         return
   }
}


export const ChatMode: React.FC<ChatModeProps> = memo((props: ChatModeProps) => {
   
   const [state, dispatch] = useReducer(produce(ChatModesReducer), {
      isActive: null,
      currentMsg: null,
      follow: undefined,
      slow: undefined,
      newFollow: undefined,
      newSlow: undefined,
   })
   
   const { isOpen: slowModalIsOpen, onOpen: slowModalOnOpen, onClose: slowModalOnClose } = useDisclosure()
   const { isOpen: followModalIsOpen, onOpen: followModalOnOpen, onClose: followModalOnClose } = useDisclosure()
   
   const { children, type } = useMemo(() => props, [])
   
   const { chatClient, channel }: UseTwitchApiProps = useTwitchApi()
   
   const [statuses, setStatuses] = useState<any>()
   
   
   useEffect(() => {
      if (chatClient && channel) {
         chatClient.onNamedMessage('ROOMSTATE', (msg) => {
            setStatuses((statuses: any) => {
               dispatch({ type: 'SET_CURRENT_MSG', msg: msg })
               return {
                  sub: RoomService.tagExists('subs-only', msg) ? RoomService.hasSubsOnly(msg) : statuses['sub'],
                  emote: RoomService.tagExists('emote-only', msg) ? RoomService.hasEmoteOnly(msg) : statuses['emote'],
                  r9k: RoomService.tagExists('r9k', msg) ? RoomService.hasR9k(msg) : statuses['r9k'],
                  follow: RoomService.tagExists('followers-only', msg) ? RoomService.getFollowDelay(msg) : statuses['follow'],
                  slow: RoomService.tagExists('slow', msg) ? RoomService.getSlow(msg) : statuses['slow'],
               }
            })
         })
      }
   }, [chatClient, channel])
   
   // When statuses change
   useEffect(() => {
      if (statuses) {
         
         if (type !== 'follow' && type !== 'slow') {
            dispatch({ type: 'SET_IS_ACTIVE', isActive: statuses[type] }) // Refresh activation status
         }
         
         // Set follow delay
         if (type === 'follow' && state.currentMsg && RoomService.tagExists('followers-only', state.currentMsg)) {
            dispatch({ type: 'SET_FOLLOW_DELAY', time: Number(statuses[type]) })
            dispatch({ type: 'SET_IS_ACTIVE', isActive: Number(statuses[type]) >= 0 })
         }
         
         // Set slow delay
         if (type === 'slow' && state.currentMsg && RoomService.tagExists('slow', state.currentMsg)) {
            dispatch({ type: 'SET_SLOW_DELAY', time: Number(statuses[type]) })
            dispatch({ type: 'SET_IS_ACTIVE', isActive: Number(statuses[type]) > 0 })
         }
         
      }
   }, [statuses, state.currentMsg])
   
   
   const handleStatusChange = useCallback(() => {
      
      if (state.isActive !== null && chatClient && channel) {
         switch (type) {
            case 'sub':
               RoomService.toggleSubOnly(state.isActive, chatClient, channel)
               break
            case 'emote':
               RoomService.toggleEmoteOnly(state.isActive, chatClient, channel)
               break
            case 'r9k':
               RoomService.toggleR9k(state.isActive, chatClient, channel)
               break
            case 'follow':
               RoomService.promptFollowDelay(state.isActive, state.follow, chatClient, channel)(followModalOnOpen, dispatch)
               break
            case 'slow':
               RoomService.promptSlowDelay(state.isActive, state.slow, chatClient, channel)(slowModalOnOpen, dispatch)
               break
         }
      }
      
   }, [state.isActive])
   
   
   const { register: sl_register, errors: sl_errors, handleSubmit: sl_handleSubmit } = useForm({
      defaultValues: {
         time: 5,
      },
   })
   
   const { register: fl_register, errors: fl_errors, handleSubmit: fl_handleSubmit } = useForm({
      defaultValues: {
         time: 10,
      },
   })
   
   // const [showSlowModal, hideSlowModal] = useModal(() => (
   //    <></>
   // ))
   //
   // const [showFollowModal, hideFollowModal] = useModal(() => (
   //    <></>
   // ))
   
   const changeSlow = (data: any) =>
      dispatch({
         type: 'SET_NEW_SLOW_DELAY',
         time: data.time.trim().length === 0 ? 0 : Number(data.time.trim()),
      })
   
   const changeFollow = (data: any) =>
      dispatch({
         type: 'SET_NEW_FOLLOW_DELAY',
         time: data.time.trim().length === 0 ? 0 : Number(data.time.trim()),
      })
   
   useEffect(() =>
         RoomService.enableSlow(state.newSlow, state.slow, chatClient, channel)(slowModalOnClose)
      , [state.newSlow])
   
   useEffect(() =>
         RoomService.enableFollow(state.newFollow, state.follow, chatClient, channel)(followModalOnClose)
      , [state.newFollow])
   
   /**
    * End: Change follow delay
    */
   
   function text() {
      switch (type) {
         case 'follow':
            return (state.follow !== undefined) && RoomService.getFollowStatus(state.follow)
            break
         case 'slow':
            return (state.slow !== undefined) && <><BiAlarm /> {RoomService.getSlowStatus(state.slow)}</>
            break
         default:
            return children
      }
   }
   
   const selectedColor = (type: string) => {
      return type === 'follow' ? 'messenger.500' : (
         type === 'slow' ? 'red.500' : (
            type === 'sub' ? 'orange.500' : (
               type === 'emote' ? 'purple.500' : (
                  type === 'r9k' ? 'pink.500' : 'gray.700'
               )
            )
         )
      )
   }
   
   return (
      <>
         <Box
            as="li"
            onClick={handleStatusChange}
            py={1}
            px={2}
            bgColor={state.isActive ? selectedColor(type) : 'gray.700'}
            borderRadius={5}
            display="flex"
            alignItems="center"
            mb={2}
            sx={{
               transition: 'all .15s linear',
               cursor: 'pointer',
               fontSize: '14px',
               'svg': {
                  mr: 2,
               },
               _hover: {
                  bgColor: selectedColor(type),
               },
            }}
         >
            {text()}
         </Box>
         
         
         <Modal isOpen={slowModalIsOpen} onClose={slowModalOnClose} size={'sm'} scrollBehavior="inside">
            <ModalOverlay />
            <ModalContent>
               <ModalHeader>Slow mode</ModalHeader>
               <ModalCloseButton />
               <form onSubmit={sl_handleSubmit(changeSlow)}>
                  <ModalBody className="modview-scrollbar">
                     
                     <FormControl>
                        <Input name="time" type="text" ref={sl_register} />
                     </FormControl>
                  
                  </ModalBody>
                  <ModalFooter>
                     <Button size="sm" colorScheme="messenger.500" type="submit" mr={3}>Ok</Button>
                     <Button size="sm" variant="link" onClick={slowModalOnClose}>Cancel</Button>
                  </ModalFooter>
               </form>
            </ModalContent>
         </Modal>
         
         
         <Modal isOpen={followModalIsOpen} onClose={followModalOnClose} size={'sm'} scrollBehavior="inside">
            <ModalOverlay />
            <ModalContent>
               <ModalHeader>Follow mode</ModalHeader>
               <ModalCloseButton />
               <form onSubmit={fl_handleSubmit(changeFollow)}>
                  <ModalBody className="modview-scrollbar">
                     
                     <FormControl>
                        <Input name="time" type="text" ref={fl_register} />
                     </FormControl>
                  
                  </ModalBody>
                  <ModalFooter>
                     <Button size="sm" colorScheme="messenger.500" type="submit" mr={3}>Ok</Button>
                     <Button size="sm" variant="link" onClick={followModalOnClose}>Cancel</Button>
                  </ModalFooter>
               </form>
            </ModalContent>
         </Modal>
      </>
   )
   
})
