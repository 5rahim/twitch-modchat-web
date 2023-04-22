import React, { memo } from 'react'
import { useToggle } from '../../hooks/UseToggle'
import { useDispatch } from '../../store'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup            from 'yup'
import { getSetting } from '../../store/storage/LocalStorage'
import { SettingsActions } from '../../store/slices/SettingsSlice'
import { Box, Flex } from 'chalkui/dist/cjs/Components/Layout'
import { FormLabel } from 'chalkui/dist/cjs/React'
import { Input } from 'chalkui/dist/cjs/Components/Input'
import { FormControl } from 'chalkui/dist/cjs/Components/FormControl'
import { Button } from 'chalkui/dist/cjs/Components/Button'

interface ItemCreationFormProps {
   setting: string
   name: string
   defaultValues?: { [key: string]: any }
   buttonText?: string
}

export const ItemCreationForm: React.FC<ItemCreationFormProps> = memo((props: ItemCreationFormProps) => {
   
   const [flag, toggleFlag] = useToggle(false)
   
   const dispatch = useDispatch()
   
   const { name, setting, defaultValues, buttonText } = props
   
   const form = useForm({
      defaultValues: { [name]: '' },
      resolver: yupResolver(yup.object().shape({ [name]: yup.string().min(1).required() })),
   })
   
   function onFormSubmit(data: any) {
      const currentSettings = getSetting(setting)
      const existingSetting = !defaultValues ? currentSettings.includes(data[name]) : currentSettings.filter((val: any) => val[name] === data[name]).length > 0
      if (!existingSetting) {
         // If defaultValues then the value to insert in an object
         dispatch(SettingsActions.addItem(setting, !defaultValues ? data[name] : { [name]: data[name], ...defaultValues }))
         form.setValue(name as never, '')
      }
   }
   
   
   return (
      <>
         <Box mb={3}><Button size="sm" onClick={toggleFlag}>{ buttonText ? buttonText : 'Add'}</Button></Box>
         
         <Box sx={{ display: flag ? 'block' : 'none' }}>
            
            <form onSubmit={form.handleSubmit(onFormSubmit)}>
               
               <Flex mb={2} style={{ placeItems: 'baseline' }} justifyContent={'space-between'} gridGap=".5rem">
   
                  <FormControl id="first-name">
                     <Input size="md" type="text" ref={form.register} name={name}/>
                  </FormControl>
                  
                  <Button colorScheme="messenger.500" type={'submit'}>Add</Button>
               </Flex>
               
            </form>
            
         </Box>
   
         {/*<FormControl id="first-name" isRequired>*/}
         {/*   <FormLabel>First name</FormLabel>*/}
         {/*   <Input placeholder="First name" />*/}
         {/*</FormControl>*/}
         
      </>
   )
   
})
