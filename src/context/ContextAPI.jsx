import React, { createContext, useState } from "react";
 
export const addStaionResponseContext =createContext()
export const updateStaionResponseContext =createContext()
export const reviewAndRatingContext= createContext()
export const addVehicleResponseContext = createContext()
export const updateVehicleResponseContext = createContext()

const Contextapi = ({children})=>{
    const[addStaionResponse,setAddStaionResponse]=useState("")
    const[updateStaionResponse,setUpdateStaionResponse]=useState("")
    const[reviewStaionResponse,setReviewStaionResponse]=useState("")
    const [addVehicleResponse,setAddVehicleResponse]=useState("")
     const [updateVehicleResponse, setUpdateVehicleResponse] = useState("")

    return (
       <reviewAndRatingContext.Provider value={{reviewStaionResponse,setReviewStaionResponse}} >
           <updateStaionResponseContext.Provider value={{updateStaionResponse,setUpdateStaionResponse}}>
                <addStaionResponseContext.Provider value={{addStaionResponse,setAddStaionResponse}}>
                    <addVehicleResponseContext.Provider value={{addVehicleResponse,setAddVehicleResponse}}>
                       <updateStaionResponseContext.Provider value={{updateVehicleResponse,setUpdateVehicleResponse}}> 
                        {children}
                        </updateStaionResponseContext.Provider>
                    </addVehicleResponseContext.Provider>
                </addStaionResponseContext.Provider>
           </updateStaionResponseContext.Provider>
       </reviewAndRatingContext.Provider>
    )
}
export default Contextapi;