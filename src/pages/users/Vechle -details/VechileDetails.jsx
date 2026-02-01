import React, { useState } from "react";
import { Car, Zap, Plus, Pencil, Trash2, X } from "lucide-react";

const VehicleDetails = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" or "edit"
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    registrationNumber: "",
    chargingType: "",
    batteryCapacity: "",
  });
  const [vehicles, setVehicles] = useState([
    {
      id: "1",
      name: "Tesla Model 3",
      registrationNumber: "ABC-1234",
      chargingType: "CCS2",
      batteryCapacity: 75,
    },
    {
      id: "2",
      name: "Tata Nexon EV",
      registrationNumber: "XYZ-5678",
      chargingType: "Type 2",
      batteryCapacity: 30.2,
    },
  ]);

  const handleAddVehicle = () => {
    setModalMode("add");
    setFormData({
      name: "",
      registrationNumber: "",
      chargingType: "",
      batteryCapacity: "",
    });
    setIsModalOpen(true);
  };

  const handleUpdateVehicle = (vehicleId) => {
    const vehicle = vehicles.find((v) => v.id === vehicleId);
    if (vehicle) {
      setModalMode("edit");
      setSelectedVehicle(vehicleId);
      setFormData({
        name: vehicle.name,
        registrationNumber: vehicle.registrationNumber,
        chargingType: vehicle.chargingType,
        batteryCapacity: vehicle.batteryCapacity,
      });
      setIsModalOpen(true);
    }
  };

  const handleDeleteVehicle = (vehicleId) => {
    if (window.confirm("Are you sure you want to delete this vehicle?")) {
      setVehicles(vehicles.filter((v) => v.id !== vehicleId));
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVehicle(null);
    setFormData({
      name: "",
      registrationNumber: "",
      chargingType: "",
      batteryCapacity: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (modalMode === "add") {
      const newVehicle = {
        id: Date.now().toString(),
        ...formData,
        batteryCapacity: parseFloat(formData.batteryCapacity),
      };
      setVehicles([...vehicles, newVehicle]);
    } else {
      setVehicles(
        vehicles.map((v) =>
          v.id === selectedVehicle
            ? { ...v, ...formData, batteryCapacity: parseFloat(formData.batteryCapacity) }
            : v
        )
      );
    }
    
    handleCloseModal();
  };

  return (
    <div className="bg-neutral-900 rounded-xl overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-800 flex justify-between items-center">
        <div>
          <h2 className="text-2xl text-white font-semibold">Vehicle Details</h2>
          <p className="text-gray-400 text-sm mt-1">Manage your electric vehicles</p>
        </div>
        <button
          onClick={handleAddVehicle}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded-lg font-medium transition-colors"
        >
          <Plus size={20} />
          Add Vehicle
        </button>
      </div>

      <div className="p-6">
        {vehicles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {vehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="bg-neutral-900/50 rounded-xl p-6 border border-zinc-800 hover:border-green-500/30 hover  transition-all relative"
                onMouseEnter={() => setHoveredCard(vehicle.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="bg-green-500/10 p-3 rounded-lg border border-green-500/30">
                    <Car className="text-green-500" size={28} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-1">
                          {vehicle.name}
                        </h3>
                        <p className="text-gray-400">
                          {vehicle.registrationNumber}
                        </p>
                      </div>
                      {hoveredCard === vehicle.id && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleUpdateVehicle(vehicle.id)}
                            className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors"
                            title="Update"
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteVehicle(vehicle.id)}
                            className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-400">Charging Type</span>
                    <div className="flex items-center gap-2 text-white font-semibold">
                      <Zap className="text-green-500" size={18} />
                      {vehicle.chargingType}
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-400">Battery Capacity</span>
                    <span className="text-white font-semibold">
                      {vehicle.batteryCapacity} kWh
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <Car className="mx-auto text-gray-600 mb-4" size={48} />
            <p className="text-gray-400 text-lg mb-4">No vehicles added yet</p>
            <button
              onClick={handleAddVehicle}
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <Plus size={20} />
              Add Your First Vehicle
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-gray-900 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-gray-800">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <h3 className="text-xl font-semibold text-white">
                {modalMode === "add" ? "Add New Vehicle" : "Update Vehicle"}
              </h3>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Vehicle Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Tesla Model 3"
                  required
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Registration Number
                </label>
                <input
                  type="text"
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleInputChange}
                  placeholder="e.g., ABC-1234"
                  required
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Charging Type
                </label>
                <select
                  name="chargingType"
                  value={formData.chargingType}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                >
                  <option value="">Select charging type</option>
                  <option value="Type 1">Type 1</option>
                  <option value="Type 2">Type 2</option>
                  <option value="CCS1">CCS1</option>
                  <option value="CCS2">CCS2</option>
                  <option value="CHAdeMO">CHAdeMO</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Battery Capacity (kWh)
                </label>
                <input
                  type="number"
                  name="batteryCapacity"
                  value={formData.batteryCapacity}
                  onChange={handleInputChange}
                  placeholder="e.g., 75"
                  step="0.1"
                  required
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
                >
                  {modalMode === "add" ? "Add Vehicle" : "Update Vehicle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleDetails;