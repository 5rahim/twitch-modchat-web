import React, { memo, useCallback, useEffect, useState } from 'react'
import {
   BiAtom, BiBell, BiBellOff,
   BiChevronDown, BiFontSize, BiHealth,
   BiHide, BiShow, BiTrash,
} from 'react-icons/all'
import classNames from 'classnames'
import { GithubPicker } from "react-color"
import { useToggle } from '../../hooks/UseToggle'
import { useDispatch } from '../../store'
import { SettingsActions } from '../../store/slices/SettingsSlice'
import { Editable, EditablePreview, EditableInput } from 'chalkui/dist/cjs/Components/Editable'
import { Box, Flex } from 'chalkui/dist/cjs/Components/Layout'
import { Text } from 'chalkui/dist/cjs/Components/Typography/Text'
import { Button } from 'chalkui/dist/cjs/Components/Button'
import { PatternCell, PatternCellOption } from './PatternCell'

export const colors = [
   '#373434',
   '#4D4D4D',
   '#999999',
   '#857122',
   '#51457d',
   '#c466ff',
   '#7f3f49',
   '#8f3018',
   '#4b7f6b',
   '#697f3f',
   '#1f8d2b',
   '#1c7e8d',
   '#1c8d75',
   '#0e493c',
]


interface CellProps {
   setting: 'highlighting.users' | 'highlighting.messages' | 'moderation.autopilot.patterns' | 'moderation.games' | 'moderation.timeouts' |
      'moderation.nukes' | 'commands' | string
   data: any
}

export const Cell: React.FC<CellProps> = memo((props: CellProps) => {
   const { setting, data } = props
   
   const [displayColorPicker, setDisplayColorPicker] = useState<boolean>(false)
   
   const [isDeleting, toggleDeleting, setIsDeleting] = useToggle(false)
   
   // useEffect(() => setIsDeleting(false), [isEditing])
   
   const dispatch = useDispatch()
   
   console.log(data)
   
   const handleChangeColor = useCallback((color) => {
      dispatch(SettingsActions.updateItem(setting, 'color', data.index, color.hex))
      setDisplayColorPicker(false)
   }, [])
   
   function content() {
      
      if (setting === 'moderation.assistant.patterns') {
         
         return (
            <PatternCell body={
               <>
                  <Editable
                     defaultValue={data.pattern.pattern}
                     onSubmit={(value: any) => dispatch(SettingsActions.updateItem(setting, 'pattern', data.index, value))}
                  >
                     <Flex alignItems="center" gridGap={2}>
                        <Text width="70px" fontWeight="bold" color="#525252">Pattern: </Text>
                        <EditablePreview />
                        <EditableInput />
                     </Flex>
                  </Editable>
                  
                  <Editable
                     defaultValue={data.pattern.timeout}
                     onSubmit={(value: any) => dispatch(SettingsActions.updateItem(setting, 'timeout', data.index, value))}
                  >
                     <Flex alignItems="center" gridGap={2}>
                        <Text width="70px" fontWeight="bold" color="#525252">Timeout: </Text>
                        <EditablePreview />
                        <EditableInput />
                     </Flex>
                  </Editable>
                  
                  <Editable
                     defaultValue={data.pattern.reason}
                     onSubmit={(value: any) => dispatch(SettingsActions.updateItem(setting, 'reason', data.index, value))}
                  >
                     <Flex alignItems="center" gridGap={2}>
                        <Text width="70px" fontWeight="bold" color="#525252">Reason: </Text>
                        <EditablePreview />
                        <EditableInput />
                     </Flex>
                  </Editable>
               </>
            }
               options={
                  <>
                     <PatternCellOption
                        onClick={() => dispatch(SettingsActions.updateItem(setting, 'regex', data.index, !data.pattern.regex))}
                        icon={<BiHealth />}
                        isActive={!!data.pattern.regex}
                     />
                     
                     <PatternCellOption
                        onClick={() => dispatch(SettingsActions.updateItem(setting, 'caseSensitive', data.index, !data.pattern.caseSensitive))}
                        icon={<BiFontSize />}
                        isActive={!!data.pattern.caseSensitive}
                     />
                     
                     <PatternCellOption
                        onClick={() => dispatch(SettingsActions.updateItem(setting, 'hide', data.index, !data.pattern.hide))}
                        icon={!data.pattern.hide ? <BiShow /> : <BiHide />}
                        isActive={!data.pattern.hide}
                     />
                  </>
               }
               onDelete={() => dispatch(SettingsActions.removeItem(setting, data.index))}
               // deletion={
               //    <Button size="sm" colorScheme="red.500" onClick={() => dispatch(SettingsActions.removeItem(setting, data.index))}>Delete</Button>
               // }
            />
         )
         
      } else if (setting === 'moderation.nukes') {
         
         console.log(data)
         
         return (
            <PatternCell
               body={<>
                  <Editable
                     defaultValue={data.pattern}
                     onSubmit={(value: any) => dispatch(SettingsActions.updateItem(setting, 'pattern', data.index, value))}
                  >
                     <Flex alignItems="center" gridGap={2}>
                        <Text width="60px" fontWeight="bold" color="#525252">Pattern: </Text>
                        <EditablePreview />
                        <EditableInput />
                     </Flex>
                  </Editable>
               </>}
               options={<>
                  <Flex as="ul" style={{ listStyle: 'none', fontSize: '.8rem', alignItems: 'center', display: 'flex' }}>
                     <PatternCellOption
                        onClick={() => dispatch(SettingsActions.updateItem(setting, 'radiation', data.index, !data.radiation))}
                        icon={<BiAtom />}
                        isActive={!!data.radiation}
                     />
                     {
                        data.radiation &&
                        <Box as="li" display="flex" alignItems="center">
                            -r=
                            <Editable
                                defaultValue={data.radiationLength}
                                onSubmit={(value) => value.length > 0 && dispatch(SettingsActions.updateItem(setting, 'radiationLength', data.index, value))}
                            >
                                <EditablePreview width="20px" />
                                <EditableInput />
                            </Editable>
                        </Box>
                     }
                     <li>
                        <Editable defaultValue={data.reach} onSubmit={(value) => dispatch(SettingsActions.updateItem(setting, 'reach', data.index, value))}>
                           <EditablePreview />
                           <EditableInput />
                        </Editable>
                     </li>
                     <li>
                        <Editable defaultValue={data.duration} onSubmit={(value) => dispatch(SettingsActions.updateItem(setting, 'duration', data.index, value))}>
                           <EditablePreview />
                           <EditableInput />
                        </Editable>
                     </li>
                  </Flex>
               </>}
               onDelete={() => dispatch(SettingsActions.removeItem(setting, data.index))}
            />
         )
         
      } else if (setting === 'highlighting.messages') {
         
         return <PatternCell body={
            <Box width="480px">
               <Editable
                  defaultValue={data.pattern}
                  onSubmit={(value: any) => dispatch(SettingsActions.updateItem(setting, 'pattern', data.index, value))}
               >
                  <Flex alignItems="center" gridGap={2}>
                     {/*<Text width="60px" fontWeight="bold" color="#525252">Pattern: </Text>*/}
                     <EditablePreview />
                     <EditableInput />
                  </Flex>
               </Editable>
            </Box>
         } options={
            <>
               
               <Box
                  as="li"
                  width="20px"
                  height="20px"
                  borderRadius={3}
                  mx={1}
                  onClick={() => setDisplayColorPicker(!displayColorPicker)}
                  className="setting-cell-color"
                  style={{ backgroundColor: data.color }}
               />
               {displayColorPicker && (
                  <Box position="absolute" top="40px" right="75px" zIndex={2} style={{ marginRight: '1.6rem' }}>
                     <GithubPicker
                        width={'187px'}
                        triangle="top-right"
                        colors={colors}
                        color={data.color}
                        onChange={handleChangeColor}
                     />
                  </Box>
               )}
               
               <PatternCellOption
                  onClick={() => dispatch(SettingsActions.updateItem(setting, 'regex', data.index, !data.regex))}
                  icon={<BiHealth />}
                  isActive={!!data.regex}
               />
               
               <PatternCellOption
                  onClick={() => dispatch(SettingsActions.updateItem(setting, 'caseSensitive', data.index, !data.caseSensitive))}
                  icon={<BiFontSize />}
                  isActive={!!data.caseSensitive}
               />
               
               <PatternCellOption
                  onClick={() => dispatch(SettingsActions.updateItem(setting, 'flash', data.index, !data.flash))}
                  icon={data.flash ? <BiBell /> : <BiBellOff />}
                  isActive={!!data.flash}
               />
               
               <PatternCellOption
                  onClick={() => dispatch(SettingsActions.updateItem(setting, 'hide', data.index, !data.hide))}
                  icon={!data.hide ? <BiShow /> : <BiHide />}
                  isActive={!data.hide}
               />
            </>
         }
            onDelete={() => dispatch(SettingsActions.removeItem(setting, data.index))}
         />
         
      } else if (setting === 'highlighting.users') {
         
         return <PatternCell body={
            <Box width="480px">
               <Editable
                  defaultValue={data.name}
                  onSubmit={(value: any) => dispatch(SettingsActions.updateItem(setting, 'name', data.index, value))}
               >
                  <Flex alignItems="center" gridGap={2}>
                     {/*<Text width="60px" fontWeight="bold" color="#525252">Pattern: </Text>*/}
                     <EditablePreview />
                     <EditableInput />
                  </Flex>
               </Editable>
            </Box>
         } options={
            <>
               
               <Box
                  as="li"
                  width="20px"
                  height="20px"
                  borderRadius={3}
                  mx={1}
                  onClick={() => setDisplayColorPicker(!displayColorPicker)}
                  className="setting-cell-color"
                  style={{ backgroundColor: data.color }}
               />
               {displayColorPicker && (
                  <Box position="absolute" top="40px" right="75px" zIndex={2} style={{ marginRight: '1.6rem' }}>
                     <GithubPicker
                        width={'187px'}
                        triangle="top-right"
                        colors={colors}
                        color={data.color}
                        onChange={handleChangeColor}
                     />
                  </Box>
               )}
               
              
               <PatternCellOption
                  onClick={() => dispatch(SettingsActions.updateItem(setting, 'flash', data.index, !data.flash))}
                  icon={data.flash ? <BiBell /> : <BiBellOff />}
                  isActive={!!data.flash}
               />
               
               <PatternCellOption
                  onClick={() => dispatch(SettingsActions.updateItem(setting, 'hide', data.index, !data.hide))}
                  icon={!data.hide ? <BiShow /> : <BiHide />}
                  isActive={!data.hide}
               />
            </>
         }
            onDelete={() => dispatch(SettingsActions.removeItem(setting, data.index))}
         />
         
      } else if (setting === 'moderation.games') {
         
         return <PatternCell body={
            <Box width="480px">
               <Editable
                  defaultValue={data.game}
                  onSubmit={(value: any) => dispatch(SettingsActions.updateArrayItem(setting, data.index, value))}
               >
                  <Flex alignItems="center" gridGap={2} p={0}>
                     <EditablePreview />
                     <EditableInput />
                  </Flex>
               </Editable>
            </Box>
         } options={
            <>
               <Box ml={-2}/>
            </>
         }
            onDelete={() => dispatch(SettingsActions.removeItem(setting, data.index))}
         />
         
      } else if (setting === 'moderation.timeouts') {
         
         return <PatternCell body={
            <Box width="480px">
               <Editable
                  defaultValue={data.timeout}
                  onSubmit={(value: any) => dispatch(SettingsActions.updateArrayItem(setting, data.index, value))}
               >
                  <Flex alignItems="center" gridGap={2} p={0}>
                     <EditablePreview />
                     <EditableInput />
                  </Flex>
               </Editable>
            </Box>
         } options={
            <>
               <Box ml={-2}/>
            </>
         }
            onDelete={() => dispatch(SettingsActions.removeItem(setting, data.index))}
         />
         
      } else if (setting === 'commands') {
         
         return <PatternCell body={
            <Box width="480px">
               <Flex>
                  /<Editable
                  defaultValue={data.name}
                  onSubmit={(value: any) => dispatch(SettingsActions.updateItem(setting, 'name', data.index, value))}
               >
                  <Flex alignItems="center" gridGap={2} p={0}>
                     <EditablePreview />
                     <EditableInput />
                  </Flex>
               </Editable>
               </Flex>
   
               <Box bgColor="gray.900" p=".5rem" borderRadius={5}>
                  <Editable
                     type={'textarea'}
                     onSubmit={(value) => dispatch(SettingsActions.updateItem(setting, 'func', data.index, value))}
                     value={data.func}
                  >
                     <EditablePreview />
                     <EditableInput />
                  </Editable>
               </Box>
            </Box>
         } options={
            <>
               <Box ml={-2}/>
            </>
         }
            onDelete={() => dispatch(SettingsActions.removeItem(setting, data.index))}
         />
         
      }
      
      return
      <></>
      
   }
   
   return (
      <div className={'setting-cell'}>
         {content()}
      </div>
   )
})

