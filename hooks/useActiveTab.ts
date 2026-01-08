import { useEffect, useState } from "react";

export function useActiveTab(key:string, defalultTab:string){
    const [tab,setTab] = useState<string>(()=>{
        if(typeof window !== 'undefined'){
            const saved = localStorage.getItem(key);
            return saved ?? defalultTab;
        }
        return defalultTab;
    });

    useEffect(()=>{
        localStorage.setItem(key,tab);
    },[key,tab]);
    return [tab,setTab] as const;

} 