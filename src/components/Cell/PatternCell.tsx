import React from 'react'
import { useToggle } from '../../hooks/UseToggle'
import { Box, Flex } from 'chalkui/dist/cjs/Components/Layout'
import { BiTrash } from 'react-icons/all'

export const PatternCell: React.FC<any> = ({ body, options, onDelete }) => {
   
   const [isDeleting, toggleDeleting, setIsDeleting] = useToggle(false)
   
   return (
      <Box
         p={1}
         bgColor="gray.800"
         borderRadius={5}
         mb={2}
      >
         <Box
            p={1}
            position="relative"
         >
            <Box>
               {body}
            </Box>
            
            <Box
               position="absolute"
               top={0}
               right={0}
            >
               <Box
                  display="flex"
                  as="ul"
                  style={{ listStyle: 'none' }}
                  bgColor="gray.900"
                  alignItems="center"
                  p={2}
                  sx={{
                     li: {
                        transition: 'all .15s linear',
                        cursor: 'pointer',
                        px: 1,
                        _hover: {
                           transform: 'scale(1.3)',
                        },
                     },
                  }}
               >
                  
                  {!isDeleting ? (
                        <Box
                           as="li"
                           onClick={toggleDeleting}
                           sx={{
                              _hover: {
                                 color: 'red.500',
                              },
                           }}
                        >
                           <BiTrash />
                        </Box>
                     ) :
                     (
                        <Flex
                           fontSize=".8rem"
                           px={2}
                           sx={{
                              '> *': {
                                 transition: 'all .15s linear',
                                 cursor: 'pointer'
                              },
                              _hover: {
                                 fontSize: ".8rem"
                              }
                           }}
                           gridGap=".6rem"
                        >
                           <Box color='red.400' _hover={{ transform: 'scale(1.1)' }} onClick={onDelete}>Delete</Box>
                           <Box _hover={{ color: 'blue.500' }} onClick={toggleDeleting}>Cancel</Box>
                        </Flex>
                     )
                  }
                  
                  <Box width="1px" backgroundColor="gray.700" mx={1} />
                  
                  {options}
               
               </Box>
            </Box>
            {/*{isEditing && <Box>*/}
            {/*   {deletion}*/}
            {/*</Box>}*/}
         
         </Box>
      </Box>
   )
   
}

export const PatternCellOption: React.FC<any> = ({ onClick, isActive, icon }) => {
   
   return (
      <Box
         as="li"
         onClick={onClick}
         sx={{
            color: isActive ? '#fff' : '#525252',
         }}
      >
         {icon}
      </Box>
   )
   
}
