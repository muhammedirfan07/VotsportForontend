import { X } from "lucide-react";


const VehicleModal = ({ isOpen, mode, onSubmit, onClose, setFormData, formData }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/70 backdrop-blur-sm">
      <div className="bg-card rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-border">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h3 className="text-xl font-semibold text-foreground">
            {mode === "add" ? "Add New Vehicle" : "Update Vehicle"}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Vehicle Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={(e)=>setFormData({...formData,name:e.target.value})}
              placeholder="e.g., Tesla Model 3"
              required
              className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/60 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Registration Number
            </label>
            <input
              type="text"
              name="registrationNumber"
              placeholder="e.g., KL-07-AB-1234"
              value={formData.RegisterNumber}
              onChange={e=>(setFormData({...formData,RegisterNumber:e.target.value}))}
              required
              className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/60 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Charging Type
            </label>
            <select
              name="chargingType"
              value={formData.chargingType}
              onChange={e=>{setFormData({...formData,chargingType:e.target.value})}}
              required
              className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary/60 focus:border-transparent transition-all"
            >
              <option value="">Select charging type</option>
              <option value="slow">Slow</option>
              <option value="fast">Fast</option>
              <option value="superfast">Super Fast</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Battery Capacity (kWh)
            </label>
            <input
              type="number"
              name="batteryCapacity"
              value={formData.batteryCapacity}
              onChange={e=>setFormData({...formData,batteryCapacity:e.target.value})}
              placeholder="e.g., 75"
              step="0.1"
              required
              className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/60 focus:border-transparent transition-all"
            />
          </div>

          {/* Footer buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-secondary cursor-pointer hover:bg-muted text-secondary-foreground rounded-xl font-medium transition-colors"
            >
              Cancel
            </button>
            <button
            type="submit"
              className="flex-1 px-4 py-3 bg-primary cursor-pointer hover:bg-primary/90 text-primary-foreground rounded-xl font-medium transition-colors"
            >
              {mode === "add" ? "Add Vehicle" : "Update Vehicle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VehicleModal;