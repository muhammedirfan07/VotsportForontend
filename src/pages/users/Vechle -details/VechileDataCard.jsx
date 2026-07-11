import { useState } from "react";
import { Car, Zap, Pencil, Trash2 } from "lucide-react";


const VehicleCard = ({ vehicle, onEdit, onDelete }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="bg-muted rounded-xl p-6 border border-border hover:border-primary/40 transition-all relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-start gap-4 mb-6">
        <div className="bg-primary/10 p-3 rounded-lg border border-primary/30">
          <Car className="text-primary" size={28} />
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-1">
                {vehicle?.vehicleName}
              </h3>
              <p className="text-muted-foreground">{vehicle?.RegisterNumber}</p>
            </div>
            {/* Edit / Delete — visible only on hover */}
            {hovered && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onEdit(vehicle)}  
                  className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-500 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={()=>onDelete(vehicle._id)}
                  className="p-2 bg-destructive/20 hover:bg-destructive/30 text-destructive rounded-lg transition-colors"
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
          <span className="text-muted-foreground">Charging Type </span>
          <div className="flex items-center gap-2 text-foreground font-semibold">
            <Zap className="text-primary" size={18} />
          {vehicle?.chargingTypes}
          </div>
        </div>
        <div className="flex items-center justify-between py-2">
          <span className="text-muted-foreground">Battery Capacity</span>
          <span className="text-foreground font-semibold">
           {vehicle?.batteryCapacity} kWh
          </span>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;