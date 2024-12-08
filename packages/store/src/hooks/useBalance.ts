import { balanceAtom } from "../atoms/balanceAtom";
import { useRecoilValue } from "recoil"; 

export const useBalance = ()=>{
    return useRecoilValue(balanceAtom);
}