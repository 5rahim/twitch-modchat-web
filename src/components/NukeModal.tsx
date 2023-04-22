import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from 'chalkui/dist/cjs/React'
import { Box, Link } from 'chalkui/dist/cjs/Components/Layout'
import { Button } from 'chalkui/dist/cjs/Components/Button'
import React from 'react'
import { useDispatch, useSelector } from '../store'
import { SettingsKeys, SettingsSelectors } from '../store/slices/SettingsSlice'
import { Cell } from './Cell'
import { ItemCreationForm } from './Cell/ItemCreationForm'
import { HorizontalLine } from './UI/HorizontalLine'

export const NukeModal = ({ isOpen, onClose }: any) => {
   
   const nukes = useSelector(SettingsSelectors.nukes)
   
   return (
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
         <ModalOverlay />
         <ModalContent>
            <ModalHeader mb={3}>Nukes</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
   
               <Box>
                  <ItemCreationForm buttonText="Add nuke" setting={SettingsKeys.nukes} name={'pattern'} defaultValues={{ radiation: true, radiationLength: '5m', duration: '1m', reach: '1m' }} />
               </Box>
   
               <HorizontalLine margin={4} />
   
               <Box
                  p={2}
                  pb={0}
                  overflow="hidden"
                  bgColor="gray.700"
                  borderRadius={5}
               >
                  {nukes?.map((nuke: any, index: number) => {
                     return <Cell setting={SettingsKeys.nukes} data={{ ...nuke, index }} key={nuke.pattern} />
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
