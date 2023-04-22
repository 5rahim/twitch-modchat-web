import { Box } from 'chalkui/dist/cjs/Components/Layout'
import { MenuList } from 'chalkui/dist/cjs/Components/Menu'
import React from 'react'

export const HorizontalLine: React.FC<{ margin?: number }> = ({ margin = 2 }) => {
   
   return (
      <Box height="1px" bgColor="gray.700" width="100%" my={margin} />
   )
   
}
