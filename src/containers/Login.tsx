import { useDispatch } from '../store'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Credentials } from '../store/states/Types'
import { ApiClient, StaticAuthProvider } from 'twitch'
import { CredentialActions } from '../store/slices/CredentialSlice'
import CLIENT_ID from '../constants/client-id'
import * as yup from 'yup'
import { Box, Flex, Link } from 'chalkui/dist/cjs/Components/Layout'
import { Input } from 'chalkui/dist/cjs/Components/Input'
import { FormControl } from 'chalkui/dist/cjs/Components/FormControl'
import { Button } from 'chalkui/dist/cjs/Components/Button'


const LoginSchema = yup.object().shape({
   username: yup.string().min(2).required(),
   channel: yup.string().min(2).required(),
   token: yup.string().min(1).required(),
})

export const Login = () => {
   
   const dispatch = useDispatch()
   
   const [loginError, setLoginError] = useState<boolean>(false)
   
   const { register, errors, handleSubmit } = useForm({
      defaultValues: {
         username: '[myusername]',
         channel: '[streamer]',
         token: 'ru83sjsmc20fhx6yebyhg70ze7jp9s',
      },
      resolver: yupResolver(LoginSchema),
   })
   
   const onSubmit = async (data: Credentials) => {
      setLoginError(false)
      data.username = data.username.trim()
      data.token = data.token.trim()
      data.channel = data.channel.trim()
      
      const authProvider = new StaticAuthProvider(CLIENT_ID, data.token, ['chat:read', 'chat:edit', 'channel:moderate', 'user:read:email'], 'user')
      const twitchClient = new ApiClient({ authProvider })
      
      // Check if user exists
      twitchClient?.helix?.users?.getMe(true)?.then(me => {
         if (me) {
            
            setLoginError(false)
            
            console.log('[LOGIN]', me)
            
            dispatch(CredentialActions.save(data))
            
            // dispatch(AccountActions.login())
         }
      }).catch(e => {
         setLoginError(true)
      })
      
   }
   
   return (
      <Flex
         justifyContent="center"
         height="100vh"
      >
         
         {/*<Flex justifyContent={'flex-start'} width={'100%'}>*/}
         {/*   /!*<Logo mb={4} />*!/*/}
         {/*</Flex>*/}
         
         <Box
            width='50%'
            p={5}
         >
            
            <Box mb={4}>
               <h1>Login</h1>
            </Box>
            
            {loginError && <p className="form-error">Invalid OAuth token, try again</p>}
            <form onSubmit={handleSubmit(onSubmit)}>
               <FormControl>
                  <label htmlFor="username">Username</label>
                  <Input name="username" type="text" ref={register} />
                  {errors.username && <p className="fieldError">Invalid username</p>}
               </FormControl>
               <FormControl>
                  <label htmlFor="channel">Channel</label>
                  <Input name="channel" type="text" ref={register} />
               </FormControl>
               <FormControl>
                  <label htmlFor="token">OAuth Token</label>
                  <Input name="token" type="text" ref={register} />
                  {errors.token && <p className="fieldError">Invalid token</p>}
               </FormControl>

               <Box my={2}>
                  <Link href={'http://gettc.xyz/password/'} target="_blank" color="white">Click here to generate your token</Link>
               </Box>
               
               <Box mt={1}>
                  <Button colorScheme="messenger.500" width="100%" className="button" type="submit">Continue</Button>
               </Box>
            </form>
         
         </Box>
      </Flex>
   )
   
   
}
