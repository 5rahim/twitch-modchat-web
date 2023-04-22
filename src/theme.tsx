import { extendedTheme } from 'chalkui/dist/cjs/React'
// import { createBreakpoints } from 'chalkui/chalk/Theme/Tools'

// const fonts = { mono: `'Menlo', monospace` }

// const breakpoints = createBreakpoints({
//    sm: '40em',
//    md: '52em',
//    lg: '64em',
//    xl: '80em',
// })

const theme = extendedTheme({
   styles: {
      global: {
         "html, body": {
            backgroundColor: 'gray.900',// '#f7f6ee',
         },
      },
   },
   colors: {
      // brand: {
      //    100: '#F0CEA0',
      //    200: '#3b6147', //'#386641',
      //    300: '#0E4150',
      //    400: '#29335C',
      //    500: '#65394E',
      //    600: '#772E2E',
      //    700: '#3b6147',
      //    800: '#3A302B',
      // },
      // primary: '#8937f5',
      primary: '#0E4150',
      secondary: '#3a302b',
      black: '#16161D',
      gray: {
         100: '#f9f9f9',
         200: '#eeeeee',
      },
   },
   components: {
      Input: {
         defaultProps: {
            focusBorderColor: 'secondary',
            backgroundColor: 'gray.700',
         },
         variants: {
            outline: {
               field: {
                  border: '2px transparent solid',
                  backgroundColor: '#565656',
                  borderColor: 'transparent',
                  color: '#fff',
                  _focus: {
                     backgroundColor: 'gray.800',
                     borderColor: "messenger.500",
                     color: '#fff',
                  },
               },
            },
         },
      },
      Select: {
         defaultProps: {
            backgroundColor: '#fff',
            focusBorderColor: 'secondary',
         },
         variants: {
            outline: {
               field: {
                  borderColor: '#e0d8d5',
               },
            },
         },
      },
      Textarea: {
         defaultProps: {
            backgroundColor: '#fff',
            focusBorderColor: 'secondary',
         },
         variants: {
            outline: {
               field: {
                  borderColor: '#e0d8d5',
               },
            },
         },
      },
      Modal: {
         baseStyle: {
            header: {
               userSelect: 'none',
            },
            dialog: {
               bg: 'gray.800',
            },
         },
      },
      Editable: {
         baseStyle: {
            preview: {
               cursor: 'pointer'
            },
            input: {
               bgColor: 'gray.900'
            }
         }
      }
   },
   // fonts,
   // breakpoints,
})

export default theme
