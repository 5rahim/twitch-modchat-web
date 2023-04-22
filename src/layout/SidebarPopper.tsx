import { Box, BoxProps } from 'chalkui/dist/cjs/Components/Layout'
import React from 'react'

interface SidebarPopperProps {
   isOpen: boolean
   onClose: any
   width?: string
}

export const SidebarPopper: React.FC<BoxProps & SidebarPopperProps> = (props) => {
   
   const {
      isOpen,
      onClose,
      children,
      width = '400px',
      ...rest
   } = props
   
   
   
   return (
      <Box display={isOpen ? 'block': 'none'}>
         <Box
            position="absolute"
            width={width}
            left="65px"
            backgroundColor="gray.800"
            borderRadius={5}
            zIndex={1}
            {...rest}
         >
            {children}
         </Box>
         
         <Box
            // backgroundColor="red.100"
            position="fixed"
            zIndex={0}
            width="100%"
            height="100%"
            top={0}
            left="60px"
            onClick={onClose}
         />
      </Box>
   )
   
}
