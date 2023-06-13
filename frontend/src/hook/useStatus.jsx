import { useState,useContext,createContext,useEffect } from "react";


const Context = createContext({
    isLogin: 0,
    vc:'',
});
const ContextProvider = (props) => {
    const [isLogin,setIsLogin]=useState(localStorage.getItem('isLogin'));
    const [vc,setVc]=useState(localStorage.getItem('vc')?localStorage.getItem('vc'):'');
    useEffect(() => {
        localStorage.setItem('isLogin', isLogin);
        console.log(isLogin)
    }, [isLogin]);

    useEffect(() => {
        localStorage.setItem('vc', vc);
        console.log(vc)
    }, [vc]);

    return (
        <Context.Provider
            value={{
              isLogin,setIsLogin,
              vc,setVc
            }}
            {...props}
        />
    );
}
const UseContext = () => useContext(Context);
export { ContextProvider, UseContext};