import { Badge, Box, Flex, Link } from 'chalkui/dist/cjs/Components/Layout'
import { chalk, useColorMode, useStyles } from 'chalkui/dist/cjs/System'
import React, { forwardRef, useCallback, useState } from 'react'
import { Menu, MenuList, useTab } from 'chalkui/dist/cjs/Components/Menu'
import { useTheme } from '@emotion/react'
import {
   BiAlarmExclamation, BiBoltCircle, BiBookmark, BiBot, BiCog, BiGroup, BiMeteor,
   BiShieldQuarter, BiShow, BiSlider, BiUserCircle, BiWrench,
} from 'react-icons/all'
import { Checkbox, FormLabel, Heading, Tooltip, useDisclosure } from 'chalkui/dist/cjs/React'
import { CredentialSelectors } from '../store/slices/CredentialSlice'
import { useDispatch, useSelector } from '../store'
import { Credentials } from '../store/states/Types'
import { AccountModal } from '../components/AccountModal'
import { UserList } from '../components/UserList'
import { ChatModes } from '../components/ChatModes'
import { SidebarPopper } from './SidebarPopper'
import { FormControl } from 'chalkui/dist/cjs/Components/FormControl'
import { Switch } from '../components/UI/Switch'
import { SettingsActions, SettingsKeys, SettingsSelectors } from '../store/slices/SettingsSlice'
import { AssistantModal } from '../components/AssistantModal'
import { BodyguardModal } from '../components/BodyguardModal'
import { Button } from 'chalkui/dist/cjs/Components/Button'
import { NukePopper } from '../components/NukePopper'
import { NukeModal } from '../components/NukeModal'
import { SettingsModal } from '../components/Settings/SettingsModal'


const StyledMenuItem = chalk("a", { themeKey: "Menu.MenuItem" })

const CustomMenuItem = forwardRef(({ isActive, ...rest }: any, ref) => {
   const tabProps = useTab(rest)
   const theme = useTheme()
   const isSelected = !!tabProps["aria-selected"]
   
   const styles = useStyles()
   
   return (
      <StyledMenuItem
         theme={theme}
         __css={styles.tab}
         {...tabProps}
         justifyItems="center"
         justifyContent="center"
         px=".5rem"
         my={2}
         sx={{
            // backgroundColor: props.isActive ? 'rgba(90,90,90,0.44)' : '',
            color: isActive ? '#1e90ff' : '#7b7b7b',
         }}
         _hover={{
            bgColor: 'gray.700',
            color: 'white',
         }}
      >
         <Flex>{tabProps.children}</Flex>
         {/*{props.isActive && <Badge ml={2} colorScheme={props.isActive ? 'purple.500' : 'gray.500'} pill><BiBoltCircle/></Badge>}*/}
      </StyledMenuItem>
   )
})

export const ModViewSidebar = () => {
   
   const credentials: Credentials = useSelector(CredentialSelectors.credentials)
   const dispatch = useDispatch()
   const { isOpen: accountIsOpen, onOpen: accountOnOpen, onClose: accountOnClose } = useDisclosure()
   const { isOpen: userListIsOpen, onOpen: userListOnOpen, onClose: userListOnClose } = useDisclosure()
   const { isOpen: assistantModalIsOpen, onOpen: assistantOnOpen, onClose: assistantOnClose } = useDisclosure()
   const { isOpen: bodyguardIsOpen, onOpen: bodyguardOnOpen, onClose: bodyguardOnClose } = useDisclosure()
   const { isOpen: nukeIsOpen, onOpen: nukeOnOpen, onClose: nukeOnClose } = useDisclosure()
   const { isOpen: settingsIsOpen, onOpen: settingsOnOpen, onClose: settingsOnClose } = useDisclosure()
   // const { isOpen: modesOpen, onOpen: modesOnOpen, onClose: modesOnClose, onToggle: modesOnToggle } = useDisclosure()
   
   const [openedSection, setOpenedSection] = useState<string | null>(null)
   const quickMode = useSelector(SettingsSelectors.quickMode)
   const assistantIsOpen = useSelector(SettingsSelectors.assistantIsOn)
   
   
   const bodyguardInsult = useSelector(SettingsSelectors.bodyguardInsult)
   const bodyguardIdentityAttack = useSelector(SettingsSelectors.bodyguardIdentityAttack)
   const bodyguardObscene = useSelector(SettingsSelectors.bodyguardObscene)
   const bodyguardToxicity = useSelector(SettingsSelectors.bodyguardToxicity)
   const bodyguardSevereToxicity = useSelector(SettingsSelectors.bodyguardSevereToxicity)
   const bodyguardExplicit = useSelector(SettingsSelectors.bodyguardExplicit)
   const bodyguardThreat = useSelector(SettingsSelectors.bodyguardThreat)
   
   
   const openSection = useCallback((section: string) => setOpenedSection(o => o === section ? null : section), [openedSection])
   const closeSection = useCallback(() => setOpenedSection(null), [])
   
   return (
      <Flex
         bgColor="gray.800"
         justifyContent="center"
         py={2}
         transition={"all .15s linear"}
         userSelect="none"
         _hover={{
            // bgColor: '#202020'
         }}
      >
         <Box>
            
            <Menu variant="rounded" orientation="vertical" colorScheme="messenger.500" size="md" index={-1}>
               <MenuList>
                  {/*<CustomMenuItem><Box fontSize="1.6rem"><BiHome /></Box></CustomMenuItem>*/}
                  
                  <Box>
                     <CustomMenuItem onClick={settingsOnOpen}>
                        <Tooltip label="Settings" placement="right"><Box fontSize="1.6rem"><BiSlider /></Box></Tooltip>
                     </CustomMenuItem>
                  </Box>
                  
                  <Box>
                     <CustomMenuItem onClick={accountOnOpen}>
                        <Tooltip label={credentials.username} placement="right"><Box fontSize="1.6rem"><BiUserCircle /></Box></Tooltip>
                     </CustomMenuItem>
                  </Box>
                  
                  <Box height="1px" bgColor="gray.700" width="100%" my={2} />
                  
                  <CustomMenuItem onClick={userListOnOpen}>
                     <Tooltip label="User list" placement="right"><Box fontSize="1.6rem"><BiGroup /></Box></Tooltip>
                  </CustomMenuItem>
                  
                  {/*Chat modes*/}
                  <Box>
                     <ChatModes isOpen={openedSection === 'chat-modes'} onClose={closeSection} />
                     <CustomMenuItem onClick={() => openSection('chat-modes')}>
                        <Tooltip label="Chat modes" placement="right"><Box fontSize="1.6rem"><BiWrench /></Box></Tooltip>
                     </CustomMenuItem>
                  </Box>
                  
                  <Box height="1px" bgColor="gray.700" width="100%" my={2} />
                  
                  
                  {/*<CustomMenuItem>*/}
                  {/*   <Tooltip label="Nuke" placement="right"><Box fontSize="1.6rem"><BiMeteor /></Box></Tooltip>*/}
                  {/*</CustomMenuItem>*/}
                  
                  <Box>
                     <SidebarPopper isOpen={openedSection === 'nuke'} onClose={closeSection} width="400px">
                        <Box p={2}>
                           <Flex justifyContent="space-between" mb={2}>
                              <Heading mb={2}>Nuke</Heading>
                              <Button variant="secondary" size="sm" fontSize="1.2rem" onClick={nukeOnOpen}><BiCog /></Button>
                           </Flex>
                           
                           <NukePopper />
                        
                        </Box>
                     </SidebarPopper>
                     <CustomMenuItem onClick={() => openSection('nuke')}>
                        <Tooltip label="Nuke" placement="right"><Box fontSize="1.6rem"><BiMeteor /></Box></Tooltip>
                     </CustomMenuItem>
                  </Box>
                  
                  <CustomMenuItem>
                     <Tooltip label="Bookmarks" placement="right"><Box fontSize="1.6rem"><BiBookmark /></Box></Tooltip>
                  </CustomMenuItem>
                  
                  <CustomMenuItem>
                     <Tooltip label="Watchlist" placement="right"><Box fontSize="1.6rem"><BiShow /></Box></Tooltip>
                  </CustomMenuItem>
                  
                  <Box height="1px" bgColor="gray.700" width="100%" my={2} />
                  
                  {/*Quick mode*/}
                  <Box>
                     <SidebarPopper isOpen={openedSection === 'quick-mode'} onClose={closeSection} width="300px">
                        <Box p={2}>
                           <Heading mb={2}>Quick mode</Heading>
                           <Switch
                              checked={quickMode}
                              text={'Activate quick mode'}
                              onChange={() => dispatch(SettingsActions.toggle(SettingsKeys.quickMode, quickMode))}
                           />
                        </Box>
                     </SidebarPopper>
                     <CustomMenuItem isActive={quickMode} onClick={() => openSection('quick-mode')}>
                        <Tooltip label="Quick mode" placement="right"><Box fontSize="1.6rem"><BiAlarmExclamation /></Box></Tooltip>
                     </CustomMenuItem>
                  </Box>
                  
                  <Box>
                     <CustomMenuItem isActive={assistantIsOpen} onClick={assistantOnOpen}>
                        <Tooltip label="Assistant" placement="right"><Box fontSize="1.6rem"><BiBot /></Box></Tooltip>
                     </CustomMenuItem>
                  </Box>
                  
                  <Box>
                     <CustomMenuItem isActive={bodyguardInsult || bodyguardThreat || bodyguardToxicity || bodyguardSevereToxicity || bodyguardObscene || bodyguardIdentityAttack || bodyguardExplicit}
                        onClick={bodyguardOnOpen}>
                        <Tooltip label="Bodyguard" placement="right"><Box fontSize="1.6rem"><BiShieldQuarter /></Box></Tooltip>
                     </CustomMenuItem>
                  </Box>
               
               
               </MenuList>
            </Menu>
            
            {/*<IconButton*/}
            {/*   aria-label={`Switch to ${colorMode === 'light' ? 'dark' : 'light'} mode`}*/}
            {/*   variant="ghost"*/}
            {/*   colorScheme={'gray.100'}*/}
            {/*   color="current"*/}
            {/*   fontSize="20px"*/}
            {/*   onClick={toggleColorMode}*/}
            {/*   icon={colorMode === 'light' ? <BiMoon/> : <BiSun/>}*/}
            {/*/>*/}
            
            <SettingsModal isOpen={settingsIsOpen} onClose={settingsOnClose} />
            
            <AccountModal isOpen={accountIsOpen} onClose={accountOnClose} />
            
            <AssistantModal isOpen={assistantModalIsOpen} onClose={assistantOnClose} />
            
            <BodyguardModal isOpen={bodyguardIsOpen} onClose={bodyguardOnClose} />
            
            <NukeModal isOpen={nukeIsOpen} onClose={nukeOnClose} />
            
            <UserList isOpen={userListIsOpen} onClose={userListOnClose} />
         
         </Box>
      </Flex>
   )
   
}

