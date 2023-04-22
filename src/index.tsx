import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import reportWebVitals from './reportWebVitals'
import theme from './theme'
import store from './store'
import {
   ChalkProvider,
} from 'chalkui/dist/cjs/React'
import { Provider as ReduxProvider } from 'react-redux'
import { TwitchApiProvider } from './contexts/TwitchApiContext'

ReactDOM.render(
   <React.StrictMode>
      
      <TwitchApiProvider>
         
         <ReduxProvider store={store}>
            
            <ChalkProvider resetCSS theme={theme}>
               
               <App />
            
            </ChalkProvider>
         
         </ReduxProvider>
         
      </TwitchApiProvider>
   
   </React.StrictMode>,
   document.getElementById('root'),
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
