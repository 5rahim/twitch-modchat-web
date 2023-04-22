import { ThirdPartyEmotesContext, ThirdPartyEmoteState } from '../contexts/third-party-emotes'
import { useContext } from 'react'

export function useThirdPartyEmotes(): ThirdPartyEmoteState {
   return useContext(ThirdPartyEmotesContext);
}
