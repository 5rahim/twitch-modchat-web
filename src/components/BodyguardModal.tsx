import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from 'chalkui/dist/cjs/React'
import { Box, Flex } from 'chalkui/dist/cjs/Components/Layout'
import { Switch } from './UI/Switch'
import { SettingsActions, SettingsKeys, SettingsSelectors } from '../store/slices/SettingsSlice'
import { HorizontalLine } from './UI/HorizontalLine'
import { ItemCreationForm } from './Cell/ItemCreationForm'
import { Cell } from './Cell'
import { Button } from 'chalkui/dist/cjs/Components/Button'
import React from 'react'
import { useDispatch, useSelector } from '../store'
import { Editable, EditableInput, EditablePreview } from 'chalkui/dist/cjs/Components/Editable'

export const BodyguardModal = ({ isOpen, onClose }: any) => {
   
   const dispatch = useDispatch()
   
   const bodyguardMinimumProbability = useSelector(SettingsSelectors.bodyguardMinimumProbability)
   const bodyguardInsult = useSelector(SettingsSelectors.bodyguardInsult)
   const bodyguardIdentityAttack = useSelector(SettingsSelectors.bodyguardIdentityAttack)
   const bodyguardObscene = useSelector(SettingsSelectors.bodyguardObscene)
   const bodyguardToxicity = useSelector(SettingsSelectors.bodyguardToxicity)
   const bodyguardSevereToxicity = useSelector(SettingsSelectors.bodyguardSevereToxicity)
   const bodyguardExplicit = useSelector(SettingsSelectors.bodyguardExplicit)
   const bodyguardThreat = useSelector(SettingsSelectors.bodyguardThreat)
   
   
   return (
      <>
         <Modal isOpen={isOpen} onClose={onClose} size={'xl'} scrollBehavior="inside">
            <ModalOverlay />
            <ModalContent>
               <ModalHeader>Bodyguard</ModalHeader>
               <ModalCloseButton />
               <ModalBody className="modview-scrollbar">
            
                  <Text my={3} color="gray.400">Bodyguard highlights flagged messages based of their toxicity probability.</Text>
   
                  <Editable
                     my={3}
                     defaultValue={bodyguardMinimumProbability.toString()}
                     onSubmit={(value: any) => value !== '' && dispatch(SettingsActions.update(SettingsKeys.bodyguardMinimumProbability, parseFloat(value)))}
                  >
                     <Flex alignItems="center" gridGap={2}>
                        <Text fontWeight="bold">Probability: </Text>
                        <EditablePreview />
                        <EditableInput />
                     </Flex>
                  </Editable>
            
                  <Box mb={2}>
                     <Switch
                        checked={bodyguardInsult}
                        text={'Insult'}
                        onChange={() => dispatch(SettingsActions.toggle(SettingsKeys.bodyguardInsult, bodyguardInsult))}
                     />
                  </Box>
            
                  <Box mb={2}>
                     <Switch
                        checked={bodyguardIdentityAttack}
                        text={'Identity attack'}
                        onChange={() => dispatch(SettingsActions.toggle(SettingsKeys.bodyguardIdentityAttack, bodyguardIdentityAttack))}
                     />
                  </Box>
            
                  <Box mb={2}>
                     <Switch
                        checked={bodyguardObscene}
                        text={'Obscenity'}
                        onChange={() => dispatch(SettingsActions.toggle(SettingsKeys.bodyguardObscene, bodyguardObscene))}
                     />
                  </Box>
            
                  <Box mb={2}>
                     <Switch
                        checked={bodyguardToxicity}
                        text={'Toxicity'}
                        onChange={() => dispatch(SettingsActions.toggle(SettingsKeys.bodyguardToxicity, bodyguardToxicity))}
                     />
                  </Box>
            
                  <Box mb={2}>
                     <Switch
                        checked={bodyguardSevereToxicity}
                        text={'Severe toxicity'}
                        onChange={() => dispatch(SettingsActions.toggle(SettingsKeys.bodyguardSevereToxicity, bodyguardSevereToxicity))}
                     />
                  </Box>
            
                  <Box mb={2}>
                     <Switch
                        checked={bodyguardExplicit}
                        text={'Explicit'}
                        onChange={() => dispatch(SettingsActions.toggle(SettingsKeys.bodyguardExplicit, bodyguardExplicit))}
                     />
                  </Box>
            
                  <Box mb={2}>
                     <Switch
                        checked={bodyguardThreat}
                        text={'Threat'}
                        onChange={() => dispatch(SettingsActions.toggle(SettingsKeys.bodyguardThreat, bodyguardThreat))}
                     />
                  </Box>
            
               </ModalBody>
         
               <ModalFooter>
                  <Button variant="basic" onClick={onClose}>Cancel</Button>
               </ModalFooter>
            </ModalContent>
         </Modal>
      </>
   )
   
}
