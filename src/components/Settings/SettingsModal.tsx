import {
   Heading,
   MenuItem, MenuPanel, MenuPanels, Modal, ModalBody, ModalCloseButton,
   ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure,
} from 'chalkui/dist/cjs/React'
import { Box, Link } from 'chalkui/dist/cjs/Components/Layout'
import { Button } from 'chalkui/dist/cjs/Components/Button'
import React from 'react'
import { Menu, MenuList } from 'chalkui/dist/cjs/Components/Menu'
import { BiCheckShield, BiHighlight, BiListCheck, BiPaintRoll } from 'react-icons/all'
import { Switch } from '../UI/Switch'
import { SettingsActions, SettingsKeys, SettingsSelectors } from '../../store/slices/SettingsSlice'
import { useDispatch, useSelector } from '../../store'
import { ItemCreationForm } from '../Cell/ItemCreationForm'
import { Cell } from '../Cell'
import { HorizontalLine } from '../UI/HorizontalLine'

export const SettingsModal = ({ isOpen, onClose }: any) => {
   
   const separateWithLines = useSelector(SettingsSelectors.separateWithLines)
   const alternateBackground = useSelector(SettingsSelectors.alternateBackground)
   const boldUsername = useSelector(SettingsSelectors.boldUsername)
   const showTimestamp = useSelector(SettingsSelectors.showTimestamp)
   const redeemedHighlight = useSelector(SettingsSelectors.redeemedHighlight)
   const showPopupProfile = useSelector(SettingsSelectors.showPopupProfile)
   const stickAtMessage = useSelector(SettingsSelectors.stickAtMessage)
   const stickAutomodMessage = useSelector(SettingsSelectors.stickAutomodMessage)
   const highlightedUsers = useSelector(SettingsSelectors.highlightedUsers)
   const highlightedMessages = useSelector(SettingsSelectors.highlightedMessages)
   const games = useSelector(SettingsSelectors.games)
   const timeouts = useSelector(SettingsSelectors.timeouts)
   const commands = useSelector(SettingsSelectors.commands)
   
   const dispatch = useDispatch()
   
   return (
      <Modal isOpen={isOpen} onClose={onClose} size="4xl" scrollBehavior="inside">
         <ModalOverlay />
         <ModalContent>
            <ModalHeader mb={3}>Settings</ModalHeader>
            <ModalCloseButton />
            <ModalBody p={0} className="modview-scrollbar">
               
               <Menu variant="right-accent" orientation="vertical">
                  <MenuList colorScheme="messenger.500" width="200px">
                     <MenuItem><Box ml={-1} mr={1} fontSize="1.4rem"><BiPaintRoll /></Box>Appearance</MenuItem>
                     <MenuItem><Box ml={-1} mr={1} fontSize="1.4rem"><BiHighlight /></Box>Highlights</MenuItem>
                     <MenuItem><Box ml={-1} mr={1} fontSize="1.4rem"><BiListCheck /></Box>Commands</MenuItem>
                     <MenuItem><Box ml={-1} mr={1} fontSize="1.4rem"><BiCheckShield /></Box>Moderation</MenuItem>
                  </MenuList>
                  
                  <MenuPanels width="100%">
                     <MenuPanel p={0} px={4}>
                        
                        <Box mb={3}>
                           <Switch
                              checked={separateWithLines}
                              text={'Separate with lines'}
                              onChange={() => dispatch(SettingsActions.toggle(SettingsKeys.separateWithLines, separateWithLines))} />
                        </Box>
                        <Box mb={3}>
                           <Switch
                              checked={alternateBackground}
                              text={'Alternate background color'}
                              onChange={() => dispatch(SettingsActions.toggle(SettingsKeys.alternateBackground, alternateBackground))} />
                        </Box>
                        <Box mb={3}>
                           <Switch
                              checked={boldUsername}
                              text={'Bold username'}
                              onChange={() => dispatch(SettingsActions.toggle(SettingsKeys.boldUsername, boldUsername))} />
                        </Box>
                        <Box mb={3}>
                           <Switch
                              checked={showTimestamp}
                              text={'Show timestamp'}
                              onChange={() => dispatch(SettingsActions.toggle(SettingsKeys.showTimestamp, showTimestamp))} />
                        </Box>
                        <Box mb={3}>
                           <Switch
                              checked={redeemedHighlight}
                              text={'Highlight messages redeemed with channel points'}
                              onChange={() => dispatch(SettingsActions.toggle(SettingsKeys.redeemedHighlight, redeemedHighlight))} />
                        </Box>
                        <Box mb={3}>
                           <Switch
                              checked={stickAutomodMessage}
                              text={'Stick automod messages'}
                              onChange={() => dispatch(SettingsActions.toggle(SettingsKeys.stickAutomodMessage, stickAutomodMessage))} />
                        </Box>
                        <Box mb={3}>
                           <Switch
                              checked={stickAtMessage}
                              text={'Stick mention messages'}
                              onChange={() => dispatch(SettingsActions.toggle(SettingsKeys.stickAtMessage, stickAtMessage))} />
                        </Box>
                     
                     </MenuPanel>
                     
                     <MenuPanel p={0} px={4}>
                        
                        <Menu variant="rounded" colorScheme="messenger.500">
                           <MenuList>
                              <MenuItem>Messages</MenuItem>
                              <MenuItem>Users</MenuItem>
                           </MenuList>
                           
                           <MenuPanels>
                              
                              {/*Messages*/}
                              <MenuPanel p={0} py={4}>
                                 
                                 <ItemCreationForm buttonText="Add message" setting={SettingsKeys.highlightedMessages} name={'pattern'} defaultValues={{ color: '#373434', flash: false, caseSensitive: false, regex: false, hide: false }} />
                                 
                                 <HorizontalLine margin={4} />
                                 
                                 <Box
                                    p={2}
                                    pb={1}
                                    // overflow="hidden"
                                    bgColor="gray.700"
                                    borderRadius={5}
                                    mb={12}
                                 >
                                    {highlightedMessages?.map((data: any, index: number) => {
                                       return <Cell setting={SettingsKeys.highlightedMessages} data={{ ...data, index }} key={data.pattern} />
                                    })}
                                 </Box>
                              
                              </MenuPanel>
                              
                              {/*Users*/}
                              <MenuPanel p={0} py={4}>
                                 
                                 <ItemCreationForm buttonText="Add user" setting={SettingsKeys.highlightedUsers} name={'name'} defaultValues={{ color: '#373434', flash: false, hide: false }} />
                                 
                                 <HorizontalLine margin={4} />
                                 
                                 <Box
                                    p={2}
                                    pb={1}
                                    // overflow="hidden"
                                    bgColor="gray.700"
                                    borderRadius={5}
                                    mb={12}
                                 >
                                    {highlightedUsers?.map((data: any, index: number) => {
                                       return <Cell setting={SettingsKeys.highlightedUsers} data={{ ...data, index }} key={data.name} />
                                    })}
                                 </Box>
                              
                              </MenuPanel>
                           
                           </MenuPanels>
                        </Menu>
                     
                     </MenuPanel>
                     <MenuPanel p={0} px={4}>
   
                        <ItemCreationForm setting={SettingsKeys.commands} name={'name'} defaultValues={{ func: 'Your new command' }} />
   
                        <HorizontalLine margin={4} />
   
                        <Box
                           p={2}
                           pb={0}
                           overflow="hidden"
                           bgColor="gray.700"
                           borderRadius={5}
                        >
                           {commands?.map((data: any, index: number) => {
                              return <Cell setting={SettingsKeys.commands} data={{ ...data, index }} key={data.name} />
                           })}
                        </Box>
                     
                     </MenuPanel>
                     
                     <MenuPanel p={0} px={4}>
                        
                        <Heading mb={2}>Games</Heading>
                        <Box>
                           <ItemCreationForm setting={SettingsKeys.games} name={'game'} />
                           
                           <Box
                              p={2}
                              pb={0}
                              overflow="hidden"
                              bgColor="gray.700"
                              borderRadius={5}
                           >
                              {games?.map((game: string, index: number) => {
                                 return <Cell setting={SettingsKeys.games} data={{ game, index }} key={index} />
                              })}
                           </Box>
                           
                           <HorizontalLine margin={4} />
                        
                        </Box>
                        
                        <Heading mb={2}>Timeouts</Heading>
                        <Box>
                           <ItemCreationForm setting={SettingsKeys.timeouts} name={'timeout'} />
                           
                           <Box
                              p={2}
                              pb={0}
                              overflow="hidden"
                              bgColor="gray.700"
                              borderRadius={5}
                           >
                              {timeouts?.map((timeout: string, index: number) => {
                                 return <Cell setting={SettingsKeys.timeouts} data={{ timeout, index }} key={timeout} />
                              })}
                           </Box>
                        </Box>
                     
                     </MenuPanel>
                  </MenuPanels>
               </Menu>
            
            </ModalBody>
            
            <ModalFooter>
               <Button variant="basic" onClick={onClose}>Cancel</Button>
            </ModalFooter>
         </ModalContent>
      </Modal>
   )
   
}
