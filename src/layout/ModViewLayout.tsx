import { chalk, useStyles } from 'chalkui/dist/cjs/System'
import React, { forwardRef } from 'react'
import { useTab } from 'chalkui/dist/cjs/Components/Menu'
import { useTheme } from '@emotion/react'
import { Badge, Box, Flex, Grid } from 'chalkui/dist/cjs/Components/Layout'

export const ModViewLayout = ({ children }: { children: React.ReactNode }) => {
   
   return (
      <Grid
         minHeight="100vh"
         minWidth="100vw"
         gridTemplateColumns={`60px auto 400px`}
      >
         {children}
      </Grid>
   )
   
}
