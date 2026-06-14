import { useEffect, useState } from "react";
import { Car, Plus } from "lucide-react";
import VehicleCard from "./VechileDataCard";
import VechileModal from "./VechileModal";
import { toast } from "react-toastify";
import { createVehicleDataAPI, removeVehicleDataAPI } from "../../../Server/allAPI.js"
import { viewSingleUserVehicleDetailsAPI } from "../../../Server/allAPI.js";


const EMPTY_FORM = {
  name: "",
  RegisterNumber: "",
  chargingType: "",
  batteryCapacity: "",
};

const VehicleDetails = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedId, setSelectedId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)  
    useEffect(()=>{
      viewAllVehicle()
    },[])
   
  const openAddModal = () => {
    setModalMode("add");
    setFormData(EMPTY_FORM);
    setSelectedId(null);
    setIsModalOpen(true);
  };

  //add vehicle---
  const HandleAdd = async (e) => {
    e.preventDefault();
    console.log("formData:", formData);
    //API call
    const userData = sessionStorage.getItem("user")
    console.log(userData);
    const user = JSON.parse(userData)
    const userId = user?._id
    console.log(userId);

    if (!userId) {
      toast.error("User not found. Please log in.");
      return;
    }

    const token = sessionStorage.getItem("token")
    if (!token) {
      toast.error(" token not founded. authentication failed")
      return
    }
    const reqHeader = {
      Authorization: `Bearer ${token}`  
    }
    const { name, RegisterNumber, chargingType, batteryCapacity } = formData
    const reqBody = {
      vehicleName: name,
      RegisterNumber,
      chargingTypes: chargingType,
      batteryCapacity
    }
    try {
      const result = await createVehicleDataAPI(reqBody, reqHeader)
      if (result.status === 201) {
        console.log(" result = ", result?.data)
        toast.success("  new vehicle data create  ",{ position: "top-right",
          theme:"dark"})
        closeModal()
      } else {
        toast.error(result?.data?.message || "Failed to  create to vehicle data", {
          position: "top-right",
          theme: "dark",
        });
      }

    } catch (error) {
      console.error("error submitting ", error)
      toast.error("Something went wrong!", { position: "bottom-right", theme: "dark" });
    }

  }
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedId(null);
    setFormData(EMPTY_FORM);
  };

//view vehicle --
 const viewAllVehicle = async()=>{
   const  token =sessionStorage.getItem("token")
    const reqHeader = {
      Authorization: `Bearer ${token}`  
    }
    try {
     const  response = await viewSingleUserVehicleDetailsAPI(reqHeader)
     setVehicles(response?.data)
       console.log("all reviews :",response?.data);
     
    } catch ( error) {
      console.log(error);
      
    }finally{
      setLoading(false)
    }
 }

 const handleRemove = async(id)=>{
  const token = sessionStorage.getItem("token")
  const reqHeader ={
    Authorization :`Bearer ${token}`
  }
  try {
    const removeVehicle = await removeVehicleDataAPI(id,reqHeader)
    console.log("removeVehicle =",removeVehicle);
    
    if(removeVehicle.status===200){
      toast.success(removeVehicle.data.message,{theme:"dark",position:"top-right"})
      viewAllVehicle()
    }
    
  } catch (error) {
    
  }
 }


  return (
    <div className="bg-neutral-900 font-[DM_Sans] rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-800 flex justify-between items-center">
        <div>
          <h2 className="text-xl md:text-2xl text-white font-semibold">
            Vehicle Details
          </h2>
          <p className="text-gray-400 text-xs md:text-sm mt-1">
            Manage your electric vehicles
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-green-700 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-sm md:font-medium  transition-transform duration-200 group cursor-pointer "
        >
          <Plus size={20} className="transition-transform group-hover:rotate-180 duration-200 " />
          Add Vehicle
        </button>
      </div>

      {/* Card grid */}
            <div className="p-6">
        {loading ? (
          <p className="text-gray-400 text-center py-8">Loading vehicles...</p>
        ) : vehicles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {vehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle._id}
                vehicle={vehicle} 
                onDelete={handleRemove}
              />
            ))}
          </div>

        ) : (
          <div className="py-12 text-center">
            <Car className="mx-auto text-gray-600 mb-4" size={48} />
            <p className="text-gray-400 text-lg mb-4">No vehicles added yet</p>
            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <Plus size={20} />
              Add Your First Vehicle
            </button>
          </div>
        )}
      </div>
      <VechileModal
        isOpen={isModalOpen}
        mode={modalMode}
        onClose={closeModal}
        onSubmit={HandleAdd}
        setFormData={setFormData}
        formData={formData}
      />
    </div>
  );
};

export default VehicleDetails;