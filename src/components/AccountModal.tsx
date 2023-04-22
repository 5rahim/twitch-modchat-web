import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from 'chalkui/dist/cjs/React'
import { Box, Link } from 'chalkui/dist/cjs/Components/Layout'
import { Button } from 'chalkui/dist/cjs/Components/Button'
import React from 'react'
import { useTwitchApi } from '../hooks/UseAPI'
import { useToggle } from '../hooks/UseToggle'
import { Credentials } from '../store/states/Types'
import { useDispatch, useSelector } from '../store'
import { CredentialSelectors } from '../store/slices/CredentialSlice'
import { AppActions } from '../store/slices/AppSlice'

export const AccountModal = ({ isOpen, onClose }: any) => {
   
   const credentials: Credentials = useSelector(CredentialSelectors.credentials)
   const { channel } = useTwitchApi()
   const [confirmation, toggleConfirmation] = useToggle(false)
   const dispatch = useDispatch()
   
   
   function onSignout() {
      dispatch(AppActions.logout())
   }
   
   
   return (
      <Modal isOpen={isOpen} onClose={onClose}>
         <ModalOverlay />
         <ModalContent>
            <ModalHeader>Account</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
               <Box mb={2}>Your account is: <strong>{credentials.username}</strong></Box>
               <Box mb={2}>Channel: <strong>{channel}</strong></Box>
            
               <Box
                  bgColor="gray.700"
                  p={3}
                  borderRadius={5}
               >
                  <Box mb={2}>
                     <Link onClick={toggleConfirmation}>Change account / Change channel</Link>
                     <Box>
                        <i>This won't log you out</i>
                     </Box>
                  </Box>
                  <Box display={confirmation ? 'block' : 'none'}>
                     <Button size="sm" colorScheme="red.500" onClick={onSignout}>Confirm</Button>
                  </Box>
               </Box>
            </ModalBody>
         
            <ModalFooter>
               <Button variant="basic" onClick={onClose}>Cancel</Button>
            </ModalFooter>
         </ModalContent>
      </Modal>
   )
   
}
