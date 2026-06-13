import { useState } from "react";
import { Car, Zap, Pencil, Trash2 } from "lucide-react";


const VehicleCard = ({ vehicle, onEdit, onDelete }) => {
  const [hovered, setHovered] = useState(false);

  const viewAllVehicle =async()=>{
    
  }

  return (
    <div
      className="bg-neutral-900/50 rounded-xl p-6 border border-zinc-800 hover:border-green-500/30 transition-all relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-start gap-4 mb-6">
        <div className="bg-green-500/10 p-3 rounded-lg border border-green-500/30">
          <Car className="text-green-500" size={28} />
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-semibold text-white mb-1">
                {vehicle?.vehicleName}
              </h3>
              <p className="text-gray-400">{vehicle?.RegisterNumber}</p>
            </div>

            {/* Edit / Delete — visible only on hover */}
            {hovered && (
              <div className="flex items-center gap-2">
                <button
                  onClick=""
                  className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick=""
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
          <span className="text-gray-400">{vehicle?.chargingTypes}</span>
          <div className="flex items-center gap-2 text-white font-semibold">
            <Zap className="text-green-500" size={18} />
           fast
          </div>
        </div>
        <div className="flex items-center justify-between py-2">
          <span className="text-gray-400">{vehicle?.batteryCapacity}</span>
          <span className="text-white font-semibold">
            200 kWh
          </span>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;