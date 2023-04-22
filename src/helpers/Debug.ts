type DebugTypes = 'error' | 'log'

const Debug = (type: DebugTypes, ...msg: any) => {
   
   if(type === 'error') console.log('[ModChat Debug:Error]', ...msg)
   else if (type === 'log') console.log(...msg)
   
}

export default Debug
