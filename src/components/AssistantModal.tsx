import { FormLabel, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from 'chalkui/dist/cjs/React'
import { Box, Link } from 'chalkui/dist/cjs/Components/Layout'
import { Button } from 'chalkui/dist/cjs/Components/Button'
import React from 'react'
import { useTwitchApi } from '../hooks/UseAPI'
import { useToggle } from '../hooks/UseToggle'
import { Credentials } from '../store/states/Types'
import { useDispatch, useSelector } from '../store'
import { CredentialSelectors } from '../store/slices/CredentialSlice'
import { AppActions } from '../store/slices/AppSlice'
import { SettingsActions, SettingsKeys, SettingsSelectors } from '../store/slices/SettingsSlice'
import { Switch } from './UI/Switch'
import { Cell } from './Cell'
import { HorizontalLine } from './UI/HorizontalLine'
import { FormControl } from 'chalkui/dist/cjs/Components/FormControl'
import { Input } from 'chalkui/dist/cjs/Components/Input'
import { ItemCreationForm } from './Cell/ItemCreationForm'

export const AssistantModal = ({ isOpen, onClose }: any) => {
   
   const credentials: Credentials = useSelector(CredentialSelectors.credentials)
   const { channel } = useTwitchApi()
   const [confirmation, toggleConfirmation] = useToggle(false)
   const dispatch = useDispatch()
   
   const assistantIsOn = useSelector(SettingsSelectors.assistantIsOn)
   const assistantPatterns = useSelector(SettingsSelectors.assistantPatterns)
   
   
   function onSignout() {
      dispatch(AppActions.logout())
   }
   
   
   return (
      <Modal isOpen={isOpen} onClose={onClose} size={'xl'} scrollBehavior="inside">
         <ModalOverlay />
         <ModalContent>
            <ModalHeader>Assistant</ModalHeader>
            <ModalCloseButton />
            <ModalBody className="modview-scrollbar">
               
               <Text my={3} color="gray.400">Assistant highlights flagged messages and allows you to quickly timeout users</Text>
               
               <Box>
                  <Switch
                     checked={assistantIsOn}
                     text={'Activate assistant'}
                     onChange={() => dispatch(SettingsActions.toggle(SettingsKeys.assistantIsOn, assistantIsOn))}
                  />
               </Box>
               
               <HorizontalLine margin={4} />
               
               <Box>
                  <ItemCreationForm buttonText="Add new pattern" setting={SettingsKeys.assistantPatterns} name={'pattern'} defaultValues={{ timeout: '1m', reason: 'Stop!', caseSensitive: false, regex: false, hide: false }} />
               </Box>
               
               <HorizontalLine margin={4} />
               
               <Box
                  p={2}
                  pb={0}
                  overflow="hidden"
                  bgColor="gray.700"
                  borderRadius={5}
               >
                  {assistantPatterns?.map((pattern: any, index: number) => {
                     return <Cell setting={SettingsKeys.assistantPatterns} data={{ pattern, index }} key={pattern.pattern} />
                  })}
               </Box>
            
            </ModalBody>
            
            <ModalFooter>
               <Button variant="basic" onClick={onClose}>Cancel</Button>
            </ModalFooter>
         </ModalContent>
      </Modal>
   )
   
}
