import React, { useEffect } from 'react'
import logo from './logo.svg'
import { useInitSettings } from './hooks/UseInitSettings'
import { useSelector } from './store'
import { SettingsSelectors } from './store/slices/SettingsSlice'
import { Box } from 'chalkui/dist/cjs/Components/Layout'
import { Login } from './containers/Login'
import { AppSelectors } from './store/slices/AppSlice'
import { useTwitchConnection } from './hooks/UseTwitchConnection'
import { ModView } from './containers/ModView'
import { ColorModeScript } from 'chalkui/dist/cjs/ColorMode'

function App() {
   
   useInitSettings()
   const { loading } = useTwitchConnection()
   
   const settings = useSelector(SettingsSelectors.settings)
   const needLogin = useSelector(AppSelectors.needLogin)
   
   useEffect(() => {
      console.log(settings)
   }, [settings])
   
   return (
      <>
         <ColorModeScript />
         <div className="App">
            
            {!loading ? (needLogin === true ? <Login /> : <ModView />) : `Loading...`}
         
         </div>
      </>
   )
}

export default App
