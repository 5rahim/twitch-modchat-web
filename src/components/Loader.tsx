import PulseLoader from 'react-spinners/PulseLoader'
import React       from 'react'

export const Loader = ({ size = 8 }: { size?: number }) => {
   
   return <PulseLoader size={size} color={'#fff'}/>
   
}
