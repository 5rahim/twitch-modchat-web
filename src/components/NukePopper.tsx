import { Box, Flex } from 'chalkui/dist/cjs/Components/Layout'
import React, { useState } from 'react'
import { useSelector } from '../store'
import { SettingsSelectors } from '../store/slices/SettingsSlice'
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from 'chalkui/dist/cjs/React'
import { Button } from 'chalkui/dist/cjs/Components/Button'

export const NukePopper = () => {
   
   const { isOpen, onOpen, onClose } = useDisclosure()
   const [rawNuke, setRawNuke] = useState<string | null>(null)
   
   const nukes = useSelector(SettingsSelectors.nukes)
   
   return (
      <>
         <Box as="ul" style={{ listStyle: 'none' }}>
            {nukes?.map((nuke: any, index: number) => {
               return <Box
                  as="li"
                  key={nuke.pattern}
                  px={2}
                  py={1}
                  bgColor="gray.700"
                  mb={2}
                  borderRadius={5}
                  cursor="pointer"
                  _hover={{ bgColor: 'gray.600' }}
                  onClick={onOpen}
               >
            
                  <Flex justifyContent="space-between">
                     <Box style={{
                        height: '19px',
                        display: 'block',
                        width: '199px',
                        overflow: 'hidden',
                     }}>
                        {nuke.pattern}
                     </Box>
                     <Box color="gray.200">[{nuke.radiation ? `-r=${nuke.radiationLength}` : ``} {nuke.reach} {nuke.duration}]</Box>
                  </Flex>
         
               </Box>
            })}
         </Box>
   
         <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
               <ModalBody p={4} display="flex" justifyContent="space-between">
                  <Button colorScheme="green.500">Send nuke</Button>
                  <Button onClick={onClose}>Cancel</Button>
               </ModalBody>
            </ModalContent>
         </Modal>
      
      </>
   )
   
}
