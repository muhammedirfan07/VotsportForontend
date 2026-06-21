import commonAPI from "./commonAPI";
import SERVER_URL from "./serverURL";

// register user and Admin...
export const registerAPI= async(reqBody)=>{
    return await commonAPI("POST",`${SERVER_URL}/Register`,reqBody)
}
// login user and Admin...
export const loginAPI= async(reqBody)=>{
    return await commonAPI("POST",`${SERVER_URL}/login`,reqBody)
}

// google user authentication...
export const googleAuthAPI =async (reqBody)=>{
    return await commonAPI("POST",`${SERVER_URL}/google-login`,reqBody)
}

// -------ADMIN DASHBOARD ------ 
 //getting all user details
export const getallUsersAPI =async()=>{
    return await commonAPI("GET",`${SERVER_URL}/admin/allUsers`,{})
}

// get all user count
export const getNumberOfUserAPI=async()=>{
    return await commonAPI("GET",`${SERVER_URL}/admin/UserCount`,{})
}
// get all Partner details
export const getallPatnersAPI =async()=>{
    return await commonAPI("GET",`${SERVER_URL}/admin/viewAllPatener`,{})
}
// get all number of partner
export const getNumberOfPatnersAPI =async()=>{
    return await commonAPI("GET",`${SERVER_URL}/admin/patnerCount`,{})
}
// approve and rejected the station
export const approveAndRejectAPI = async(stationId,reqBody,reqHeader)=>{
    return await commonAPI("PUT",`${SERVER_URL}/approveRejectStation/${stationId}`,reqBody,reqHeader)
} 
// get all number of ev stations
export const getNumberOfStationAPI =async()=>{
    return await commonAPI("GET",`${SERVER_URL}/admin/sationCount`,{})
}
// get the data in chart formate 
export const getChartDeatilsAPI =async()=>{
    return commonAPI("GEt",`${SERVER_URL}/admin/chart`,{})
}



//------------------PARTNERS----------------------
//partners register--------
export const partnersRegisterAPI=async(reqBody)=>{
    return await commonAPI("POST",`${SERVER_URL}/patner/patnerRegister`,reqBody)

}
// Email Verification--------
export const EmailVerifationAPI=async(reqBody)=>{
    return await commonAPI("POST",`${SERVER_URL}/patner/verfiyemail`,reqBody)

}
// re-send otp--------------
export const reSendOtpAPI =async(reqBody)=>{
    return await commonAPI("POST",`${SERVER_URL}/patner/reSendOtp`,reqBody)
}
//partner login----------------
export const patnersLoginAPI=async(reqBody)=>{
    return await commonAPI("POST",`${SERVER_URL}/patner/patnerlogin`,reqBody)

}
//view our add station--------------
export const viewOurStationsAPI=async(reqHeader)=>{
    return await commonAPI("GET",`${SERVER_URL}/patner/partner-stations`,{},reqHeader)
}

// notification
export const viewNotificationsAPI = (reqHeader) => {
    return commonAPI("GET", `${SERVER_URL}/notifications`,{},reqHeader);
  };
  
//   export const markNotificationAsReadAPI = (notificationId) => {
//     return commonAPI("PUT", `${SERVER_URL}/notifications/${notificationId}/read`);
//   };

// delete single notification
export const deleteNotificationAPI = (notificationId,reqHeader) => {
    return commonAPI("DELETE", `${SERVER_URL}/notifications/${notificationId}`,{},reqHeader);
  };

// delete all notifications
  export const deleteAllNotificationsAPI = (reqHeader) => {
    return commonAPI("DELETE", `${SERVER_URL}/notifications`,{},reqHeader);
  };




//---------------------STATION---------------------
//add station
export const addStaionAPI=async(reqBody,reqHeader)=>{
    return await commonAPI("POST",`${SERVER_URL}/add-chargingStation`,reqBody,reqHeader)
}
//view charging station
export const viewAllStayionAPI =async()=>{
    return await commonAPI("GET",`${SERVER_URL}/view-charingStation`,{})
}
// UPDATE the station
export const updateStaionAPI=async(id,reqBody,reqHeader)=>{
    return await commonAPI("PUT",`${SERVER_URL}/update-chargingStation/${id}`,reqBody,reqHeader)
}
//delete the station
export const deleteStaionAPI=async(id,reqHeader)=>{
    return await commonAPI("DELETE",`${SERVER_URL}/delete-chargingStation/${id}`,{},reqHeader)
}


//--------------------------USERS-------------------------------
//  single user details
export const singleUserDetailsAPI = async(userId,reqHeader)=>{
    return await commonAPI("GET",`${SERVER_URL}/user/userDetails/${userId}`,{},reqHeader)
}

// view stations
 export const feachApproveStationAPI =async(reqHeader)=>{
   return await commonAPI("GET",`${SERVER_URL}/user/viewSations`,{},reqHeader)
 }
 // view single station 
 export const getSingleStaionAPI =async(stationId)=>{
    return await commonAPI("GET",`${SERVER_URL}/view-chargingStation/${stationId}`,{})
 }
 // booking station
 export const bookingStaionAPI =async(reqBody,reqHeader)=>{
    return await commonAPI("POST",`${SERVER_URL}/user/booking`,reqBody,reqHeader)
 }
 //available slot viewing
 export const avilableSlotAPI =async(stationId,startTime,slotNumber,duration,reqHeader)=>{
    return await commonAPI("GET",`${SERVER_URL}user/slots?stationId=${stationId}&startTime=${startTime}&duration=${duration}&slotNumber=${slotNumber}`,{},reqHeader)
 }
 //filer the stations 
 export const filterStationAPI =async(city,state,chargingType,vehicleType,reqHeader)=>{
    return await commonAPI("GET",`${SERVER_URL}/filter?city=${city}&state=${state}&chargingType=${chargingType}&vehicleType=${vehicleType}`,{},reqHeader)
 }

 // add reviews
 export const addReviewAPI =async(reqBody,reqHeader)=>{
    return await commonAPI("POST",`${SERVER_URL}/addreview`,reqBody,reqHeader)
 }
 // view review and rating
 export const viewReviewAPI =async(stationId,reqHeader)=>{
    return await commonAPI("GET",`${SERVER_URL}/viewreview?stationId=${stationId}`,{},reqHeader)
 }
//  Payment 
export const paymentAPI = async (stationId, userId, totalPrice) => {
    return await commonAPI("POST", `${SERVER_URL}/user/payment`, {
      stationId,
      userId,
      price: totalPrice,  
    });
  };

  // view booking history 
export const viewBookingAPI = async (userId,reqHeader)=>{
    return await commonAPI("GET",`${SERVER_URL}/veiw-allBooking?userId=${userId}`,{},reqHeader)
}

// add  our vehicles details------

export const createVehicleDataAPI =async(reqBody,reqHeader)=>{
    return await commonAPI("POST",`${SERVER_URL}/createVehicle`,reqBody,reqHeader)
}

// view single user vehicle details.
export const viewSingleUserVehicleDetailsAPI =async(reqHeader)=>{
    return await commonAPI("GET",`${SERVER_URL}/viewVehicle`,null,reqHeader)
}

//update single user vehicle details
export const updateVehicleDataAPI = async(id,reqBody,reqHeader)=>{
    return await commonAPI("PUT",`${SERVER_URL}/updateVehicle/${id}`,reqBody,reqHeader)
}

// delete a single user vehicle details
export const removeVehicleDataAPI = async (id,reqHeader)=>{
    return await commonAPI("DELETE",`${SERVER_URL}/removeVehicle/${id}`,{},reqHeader)
}



export const getWalletSummaryAPI = async (reqHeader) => {
  return await commonAPI("GET", `${SERVER_URL}/wallet-summary`, {}, reqHeader);
};