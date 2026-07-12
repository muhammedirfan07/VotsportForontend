import React, { useContext, useEffect, useState } from "react";
import { Upload, X } from "lucide-react"; // Import icons from lucide-react
import { updateStaionAPI } from "../../Server/allAPI";
import { updateStaionResponseContext } from "../../context/ContextAPI";
import { toast } from "react-toastify";



const UpdateStation = ({ station }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(
    station.image || null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { updateStaionResponse, setUpdateStaionResponse } = useContext(updateStaionResponseContext)

  const [addStationDetails, setAddStationDetails] = useState({
    id: station._id,
    stationName: station.stationName,
    chargingType: station.chargingType,
    vehicleType: station.vehicleType,
    mapUrl: station.mapUrl,
    pricePerHour: station.pricePerHour,
    image: station.image,
    latitude: station.location.coordinates[1],
    longitude: station.location.coordinates[0],
    city: station.city,
    state: station.state,
    availableSlots: station.availableSlots,
  });
  console.log(addStationDetails);


  useEffect(() => {
    setPreviewUrl(station.image || null)
    setImage(null)
  }, [station.image]);

  // modal open/close
  const openModal = () => {
    setIsOpen(true);
    setImage(null)
    setPreviewUrl(station.image || null)
    setAddStationDetails({
      id: station._id,
      stationName: station.stationName,
      chargingType: station.chargingType,
      vehicleType: station.vehicleType,
      mapUrl: station.mapUrl,
      pricePerHour: station.pricePerHour,
      image: station.image,
      latitude: station.location.coordinates[1],
      longitude: station.location.coordinates[0],
      city: station.city,
      state: station.state,
      availableSlots: station.availableSlots,
    });
  };
  const closeModal = () => {
    setIsOpen(false);
    setImage(null);
    setPreviewUrl(station.image || null); 
    setAddStationDetails({
      id: station._id,
      stationName: station.stationName,
      chargingType: station.chargingType,
      vehicleType: station.vehicleType,
      mapUrl: station.mapUrl,
      pricePerHour: station.pricePerHour,
      image: station.image,
      latitude: station.location.coordinates[1],
      longitude: station.location.coordinates[0],
      city: station.city,
      state: station.state,
      availableSlots: station.availableSlots,
    });
  };

  //image upload section
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setAddStationDetails({ ...addStationDetails, image: file });
      const imageUrl = URL.createObjectURL(file);
      setPreviewUrl(imageUrl);
    }
  };

  const updateStationDetailHandler = async () => {
    console.log("inside the update handler.........💜💜");
    const {
      id,
      stationName,
      chargingType,
      mapUrl,
      pricePerHour,
      latitude,
      vehicleType,
      longitude,
      city,
      state,
      availableSlots,
      image,
    } = addStationDetails;
    console.log("updatedetails:", addStationDetails);

    // Utility function to validate latitude and longitude
    const isValidCoordinates = (longitude, latitude) => {
      const lon = parseFloat(longitude);
      const lat = parseFloat(latitude);
      return (
        !isNaN(lon) &&
        !isNaN(lat) &&
        lon >= -180 &&
        lon <= 180 &&
        lat >= -90 &&
        lat <= 90
      );
    };

    // Utility function to validate URL format
    const isValidUrl = (url) => {
      try {
        new URL(url);
        return true;
      } catch (_) {
        return false;
      }
    };

    // Validate required fields
    if (
      !stationName ||
      !chargingType ||
      !mapUrl ||
      !vehicleType ||
      !pricePerHour ||
      !latitude ||
      !longitude ||
      !city ||
      !state ||
      !availableSlots
    ) {
      toast.info("Please fill all the fields", {
        position: "top-right",
        theme: "dark",
      });
      return;
    }

  
    if (Number(availableSlots) <= 0 || Number(availableSlots) > 10) {
      toast.info("Available slots must be between 1 and 10", {
        position: "top-right",
        theme: "dark",
      });
      return;
    }

    if (Number(pricePerHour) <= 10) {
      toast.info("Price per hour must be greater than 10", {
        position: "top-right",
        theme: "dark",
      });
      return;
    }

    // Validate longitude & latitude format
    if (!isValidCoordinates(longitude, latitude)) {
      toast.error("Invalid longitude or latitude format", {
        position: "top-right",
        theme: "dark",
      });
      return;
    }

    // Validate URL format
    if (!isValidUrl(mapUrl)) {
      toast.error("Invalid map URL format", {
        position: "top-right",
        theme: "dark",
      });
      return;
    }

    setIsSubmitting(true);
    const reqBody = new FormData();
    reqBody.append("stationName", stationName);
    reqBody.append("chargingType", chargingType);
    reqBody.append("mapUrl", mapUrl);
    reqBody.append("pricePerHour", pricePerHour);
    reqBody.append("latitude", latitude);
    reqBody.append("longitude", longitude);
    reqBody.append("vehicleType", vehicleType);
    reqBody.append("city", city);
    reqBody.append("state", state);
    reqBody.append("availableSlots", availableSlots);
    reqBody.append("image", image instanceof File ? image : station.image);


    console.log("reqBody", reqBody);

    const token = sessionStorage.getItem("PartnerToken");
    if (!token) {
      toast.error("Authentication token not found", {
        position: "top-right",
        theme: "dark",
      });
      setIsSubmitting(false);
      return;
    }

    const reqHeaders = {
      Authorization: `Bearer ${token}`,
    };
    try {
      //api call
      const result = await updateStaionAPI(id, reqBody, reqHeaders);
      if (result.status == 200) {
        toast.success("successulsully updated", {
          position: "top-right",
          theme: "dark",
        });
        setUpdateStaionResponse(result)
        closeModal();
      } else {
        throw new Error("Station not found");
      }
    } catch (error) {
      toast.error("Something went wrong", { position: "bottom-right", theme: "dark" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={openModal}
        className="px-3 py-1 bg-primary/10 cursor-pointer text-primary rounded-md border border-primary/30  text-xs md:text-sm whitespace-nowrap"
      >
        Update
      </button>

      {/* Modal Backdrop */}
      {isOpen && (
        <div className="fixed font-[DM_Sans] inset-0 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-card border border-border rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-2xl lg:max-w-4xl mx-auto flex flex-col max-h-[95dvh] sm:max-h-[90vh]">

            {/* Header */}
            <div className="border-b border-border px-4 py-3 md:px-6 md:py-4 flex-shrink-0">
              <div className="flex items-center justify-between">
                <h3 className="text-base md:text-lg font-semibold text-foreground">Add Station</h3>
                <button
                  onClick={closeModal}
                  className="text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors p-1.5 rounded-lg"
                >
                  <X className="h-4 w-4 md:h-5 md:w-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Body */}
            <div className="overflow-y-auto flex-1 px-4 py-4 md:px-6 md:py-5">
              <div className="flex flex-col md:flex-row gap-4 md:gap-5">

                {/* Image Upload */}
                <div className="w-full md:w-1/3 flex-shrink-0">
                  <label className="block cursor-pointer group">
                    <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                    <div className="relative rounded-xl overflow-hidden bg-background border border-dashed border-border group-hover:border-zinc-soft transition-colors">
                      {previewUrl ? (
                        <img
                          src={previewUrl || "/placeholder.svg"}
                          alt="Station preview"
                          className="w-full h-44 sm:h-52 md:h-72 lg:h-80 object-cover"
                        />
                      ) : (
                        <div className="w-full h-44 sm:h-52 md:h-72 lg:h-80 flex flex-col items-center justify-center text-muted-foreground group-hover:text-foreground transition-colors">
                          <Upload className="w-6 h-6 mb-2" />
                          <span className="text-sm text-muted-foreground">Click to upload image</span>
                          <span className="text-xs text-muted-foreground/70 mt-1">PNG, JPG up to 10MB</span>
                        </div>
                      )}
                      {previewUrl && (
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-foreground text-sm">Change image</span>
                        </div>
                      )}
                    </div>
                  </label>
                </div>

                {/* Form Fields */}
                <div className="w-full md:w-2/3 flex flex-col gap-2.5">

                  <input
                    onChange={(e) =>
                      setAddStationDetails({
                        ...addStationDetails,
                        stationName: e.target.value,
                      })
                    }
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 md:py-2.5 text-foreground placeholder-muted-foreground text-sm focus:border-ring focus:ring-1 focus:ring-ring focus:outline-none transition-colors"
                    type="text"
                    placeholder="Station name"
                    value={addStationDetails.stationName}
                  />

                  {/* Lat / Lng */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <input onChange={(e) =>
                      setAddStationDetails({
                        ...addStationDetails,
                        latitude: e.target.value,
                      })
                    } className="w-full bg-background border border-border rounded-lg px-3 py-2 md:py-2.5 text-foreground placeholder-muted-foreground text-sm focus:border-ring focus:ring-1 focus:ring-ring focus:outline-none transition-colors" type="text" placeholder="Latitude" value={addStationDetails.latitude} />
                    <input onChange={(e) =>
                      setAddStationDetails({
                        ...addStationDetails,
                        longitude: e.target.value,
                      })
                    } className="w-full bg-background border border-border rounded-lg px-3 py-2 md:py-2.5 text-foreground placeholder-muted-foreground text-sm focus:border-ring focus:ring-1 focus:ring-ring focus:outline-none transition-colors" type="text" placeholder="Longitude" value={addStationDetails.longitude} />
                  </div>

                  {/* City / State */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <input onChange={(e) =>
                      setAddStationDetails({
                        ...addStationDetails,
                        city: e.target.value,
                      })
                    } type="text" className="w-full bg-background border border-border rounded-lg px-3 py-2 md:py-2.5 text-foreground placeholder-muted-foreground text-sm focus:border-ring focus:ring-1 focus:ring-ring focus:outline-none transition-colors" placeholder="City" value={addStationDetails.city} />
                    <input onChange={(e) =>
                      setAddStationDetails({
                        ...addStationDetails,
                        state: e.target.value,
                      })
                    } className="w-full bg-background border border-border rounded-lg px-3 py-2 md:py-2.5 text-foreground placeholder-muted-foreground text-sm focus:border-ring focus:ring-1 focus:ring-ring focus:outline-none transition-colors" type="text" placeholder="State" value={addStationDetails.state} />
                  </div>

                  {/* Vehicle / Charging Type */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <select onChange={(e) =>
                      setAddStationDetails({
                        ...addStationDetails,
                        vehicleType: e.target.value,
                      })
                    } value={addStationDetails.vehicleType} className="w-full bg-background border border-border rounded-lg px-3 py-2 md:py-2.5 text-foreground placeholder-muted-foreground text-sm focus:border-ring focus:ring-1 focus:ring-ring focus:outline-none transition-colors">
                      <option value="" className="bg-card">Select vehicle type</option>
                      <option value="2-wheeler" className="bg-card">2-wheeler</option>
                      <option value="3-wheeler" className="bg-card">3-wheeler</option>
                      <option value="4-wheeler" className="bg-card">4-wheeler</option>
                    </select>
                    <select onChange={(e) =>
                      setAddStationDetails({
                        ...addStationDetails,
                        chargingType: e.target.value,
                      })
                    } value={addStationDetails.chargingType} className="w-full bg-background border border-border rounded-lg px-3 py-2 md:py-2.5 text-foreground placeholder-muted-foreground text-sm focus:border-ring focus:ring-1 focus:ring-ring focus:outline-none transition-colors">
                      <option value="" className="bg-card">Select charging type</option>
                      <option value="slow" className="bg-card">Slow</option>
                      <option value="fast" className="bg-card">Fast</option>
                      <option value="superfast" className="bg-card">Superfast</option>
                    </select>
                  </div>

                  <input onChange={(e) =>
                    setAddStationDetails({
                      ...addStationDetails,
                      mapUrl: e.target.value,
                    })
                  } className="w-full bg-background border border-border rounded-lg px-3 py-2 md:py-2.5 text-foreground placeholder-muted-foreground text-sm focus:border-ring focus:ring-1 focus:ring-ring focus:outline-none transition-colors" type="url" placeholder="Map URL" value={addStationDetails.mapUrl} />

                  {/* Slots / Price */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <input onChange={(e) =>
                      setAddStationDetails({
                        ...addStationDetails,
                        availableSlots: e.target.value,
                      })
                    } className="w-full bg-background border border-border rounded-lg px-3 py-2 md:py-2.5 text-foreground placeholder-muted-foreground text-sm focus:border-ring focus:ring-1 focus:ring-ring focus:outline-none transition-colors" type="number" placeholder="Active slots" value={addStationDetails.availableSlots} />
                    <input onChange={(e) =>
                      setAddStationDetails({
                        ...addStationDetails,
                        pricePerHour: e.target.value,
                      })
                    } className="w-full bg-background border border-border rounded-lg px-3 py-2 md:py-2.5 text-foreground placeholder-muted-foreground text-sm focus:border-ring focus:ring-1 focus:ring-ring focus:outline-none transition-colors" type="number" placeholder="Price/hr" value={addStationDetails.pricePerHour} />
                  </div>

                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-border px-4 py-3 md:px-6 md:py-4 flex justify-end gap-3 flex-shrink-0">
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground bg-secondary hover:bg-secondary/80 border border-border transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
              >
                Cancel
              </button>
              <button
                onClick={updateStationDetailHandler}
                disabled={isSubmitting}
                className={`px-4 py-2 rounded-lg text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-ring ${isSubmitting ? "opacity-60 cursor-not-allowed" : ""}`}
              >
                {isSubmitting ? "Updating..." : "update Station"}
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default UpdateStation;