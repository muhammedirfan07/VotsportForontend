import { useEffect, useState } from "react";
import { Car, Plus,Loader2 } from "lucide-react";
import VehicleCard from "./VechileDataCard";
import VechileModal from "./VechileModal";
import { toast } from "react-toastify";
import {
  createVehicleDataAPI,
  removeVehicleDataAPI,
  updateVehicleDataAPI,           
} from "../../../Server/allAPI.js";
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
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    viewAllVehicle();
  }, []);

  // ── Open ADD modal ──────────────────────────────────────────────
  const openAddModal = () => {
    setModalMode("add");
    setFormData(EMPTY_FORM);
    setSelectedId(null);
    setIsModalOpen(true);
  };

  // ── Open EDIT modal pre-filled with existing vehicle data ───────
  const openEditModal = (vehicle) => {
    setModalMode("edit");
    setSelectedId(vehicle._id);
    setFormData({
      name: vehicle.vehicleName,
      RegisterNumber: vehicle.RegisterNumber,
      chargingType: vehicle.chargingTypes,
      batteryCapacity: vehicle.batteryCapacity,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedId(null);
    setFormData(EMPTY_FORM);
  };

  // ── verification Helpers ─────────────────────────────────────────────────────
  const getAuthHeader = () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      toast.error("Token not found. Authentication failed.", {
        position: "top-right",
        theme: "dark",
      });
      return null;
    }
    return { Authorization: `Bearer ${token}` };
  };

  // ── ADD vehicle ─────────────────────────────────────────────────
  const handleAdd = async (e) => {
    e.preventDefault();

    const userData = sessionStorage.getItem("user");
    const user = JSON.parse(userData);
    const userId = user?._id;

    if (!userId) {
      toast.error("User not found. Please log in.");
      return;
    }

    const reqHeader = getAuthHeader();
    if (!reqHeader) return;

    const { name, RegisterNumber, chargingType, batteryCapacity } = formData;
    const reqBody = {
      vehicleName: name,
      RegisterNumber,
      chargingTypes: chargingType,
      batteryCapacity,
    };

    try {
      const result = await createVehicleDataAPI(reqBody, reqHeader);
      if (result.status === 201) {
        toast.success("New vehicle added!", {
          position: "top-right",
          theme: "dark",
        });
        closeModal();
        viewAllVehicle();         
      } else {
        toast.error(result?.data?.message || "Failed to create vehicle.", {
          position: "top-right",
          theme: "dark",
        });
      }
    } catch (error) {
      console.error("Error submitting:", error);
      toast.error("Something went wrong!", {
        position: "bottom-right",
        theme: "dark",
      });
    }
  };

  // ── UPDATE vehicle ──────────────────────────────────────────────
  const handleUpdate = async (e) => {
    e.preventDefault();

    const reqHeader = getAuthHeader();
    if (!reqHeader) return;

    const { name, RegisterNumber, chargingType, batteryCapacity } = formData;
    const reqBody = {
      vehicleName: name,
      RegisterNumber,
      chargingTypes: chargingType,
      batteryCapacity,
    };

    try {
      const result = await updateVehicleDataAPI(selectedId, reqBody, reqHeader);
      if (result.status === 200) {
        toast.success("Vehicle updated!", {
          position: "top-right",
          theme: "dark",
        });
        closeModal();
        viewAllVehicle();         
      } else {
        toast.error(result?.data?.message || "Failed to update vehicle.", {
          position: "top-right",
          theme: "dark",
        });
      }
    } catch (error) {
      console.error("Error updating:", error);
      toast.error("Something went wrong!", {
        position: "bottom-right",
        theme: "dark",
      });
    }
  };

  // ── VIEW all vehicles ───────────────────────────────────────────
  const viewAllVehicle = async () => {
    const reqHeader = getAuthHeader();
    if (!reqHeader) return;

    try {
      const response = await viewSingleUserVehicleDetailsAPI(reqHeader);
      setVehicles(response?.data);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    } finally {
      setLoading(false);
    }
  };

  // ── DELETE vehicle ──────────────────────────────────────────────
  const handleRemove = async (id) => {
    const reqHeader = getAuthHeader();
    if (!reqHeader) return;

    try {
      const result = await removeVehicleDataAPI(id, reqHeader);
      if (result.status === 200) {
        toast.success(result.data.message, {
          theme: "dark",
          position: "top-right",
        });
        viewAllVehicle();
      }
    } catch (error) {
      console.error("Error removing vehicle:", error);
      toast.error("Failed to delete vehicle.", {
        theme: "dark",
        position: "top-right",
      });
    }
  };

  // ── Single submit handler — delegates based on mode ─────────────
  const handleSubmit = (e) => {
    if (modalMode === "add") {
      handleAdd(e);
    } else {
      handleUpdate(e);
    }
  };

  return (
    <div className="bg-zinc-900 font-[DM_Sans] rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-zinc-800 flex justify-between items-center">
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
          className="flex items-center gap-2 bg-green-500/60 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-sm md:font-medium transition-transform duration-200 group cursor-pointer"
        >
          <Plus
            size={20}
            className="transition-transform group-hover:rotate-180 duration-200"
          />
          Add Vehicle
        </button>
      </div>

      {/* Card grid */}
      <div className="p-6">
        {loading ? (
         <p className="text-gray-400 flex gap-2 justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin mt-1" /> Loading History...
            </p>
        ) : vehicles?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {vehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle._id}
                vehicle={vehicle}
                onEdit={openEditModal}       
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
        onSubmit={handleSubmit}           
        setFormData={setFormData}
        formData={formData}
      />
    </div>
  );
};

export default VehicleDetails;