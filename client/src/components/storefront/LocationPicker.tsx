import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { X, ChevronLeft, MapPin, Check, Navigation, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { useHub, SuperHub, SubHub } from "@/context/HubContext";

type GeoStatus = "idle" | "detecting" | "serviceable" | "unserviceable" | "denied" | "error";

async function getPincodeFromCoords(lat: number, lon: number): Promise<string | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
      { headers: { "Accept-Language": "en" } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data?.address?.postcode?.replace(/\s/g, "") ?? null;
  } catch {
    return null;
  }
}

export function LocationPicker() {
  const { isPickerOpen, closePicker, setHub, selectedSuperHub, selectedSubHub } = useHub();
  const [step, setStep] = useState<"super" | "sub">("super");
  const [pickedSuper, setPickedSuper] = useState<SuperHub | null>(null);
  const [geoStatus, setGeoStatus] = useState<GeoStatus>("idle");
  const [geoMessage, setGeoMessage] = useState("");

  const { data: superHubs = [], isLoading: loadingSuper } = useQuery<SuperHub[]>({
    queryKey: ["/api/hubs/super"],
    enabled: isPickerOpen,
  });

  const { data: subHubs = [], isLoading: loadingSub } = useQuery<SubHub[]>({
    queryKey: ["/api/hubs/sub", pickedSuper?.id],
    queryFn: async () => {
      const res = await fetch(`/api/hubs/sub?superHubId=${pickedSuper!.id}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch sub hubs");
      return res.json();
    },
    enabled: !!pickedSuper,
  });

  const { data: allSubHubs = [] } = useQuery<SubHub[]>({
    queryKey: ["/api/hubs/sub-all"],
    queryFn: async () => {
      const res = await fetch("/api/hubs/sub", { credentials: "include" });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    enabled: isPickerOpen,
  });

  useEffect(() => {
    if (isPickerOpen) {
      setStep("super");
      setPickedSuper(selectedSuperHub);
      setGeoStatus("idle");
      setGeoMessage("");
    }
  }, [isPickerOpen]);

  const handleDetectLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setGeoStatus("error");
      setGeoMessage("Your browser doesn't support location detection.");
      return;
    }

    setGeoStatus("detecting");
    setGeoMessage("Detecting your location...");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setGeoMessage("Checking serviceability...");

        const pincode = await getPincodeFromCoords(latitude, longitude);

        if (!pincode) {
          setGeoStatus("error");
          setGeoMessage("Couldn't determine your area. Please select manually.");
          return;
        }

        const matchedSub = allSubHubs.find((sub) =>
          sub.pincodes.some((p) => p.replace(/\s/g, "") === pincode)
        );

        if (!matchedSub) {
          setGeoStatus("unserviceable");
          setGeoMessage(`Sorry, we don't deliver to your area yet (${pincode}).`);
          return;
        }

        const matchedSuper = superHubs.find((s) => s.id === matchedSub.superHubId);
        if (!matchedSuper) {
          setGeoStatus("error");
          setGeoMessage("Couldn't match your location. Please select manually.");
          return;
        }

        setGeoStatus("serviceable");
        setGeoMessage(`Great news! We deliver to ${matchedSub.name}.`);

        setTimeout(() => {
          setHub(matchedSuper, matchedSub);
        }, 1200);
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setGeoStatus("denied");
          setGeoMessage("Location access denied. Please allow it in your browser settings.");
        } else {
          setGeoStatus("error");
          setGeoMessage("Couldn't detect location. Please select manually.");
        }
      },
      { timeout: 10000, maximumAge: 60000 }
    );
  }, [allSubHubs, superHubs, setHub]);

  if (!isPickerOpen) return null;

  const handleSuperSelect = (hub: SuperHub) => {
    setPickedSuper(hub);
    setStep("sub");
  };

  const handleSubSelect = (sub: SubHub) => {
    if (pickedSuper) setHub(pickedSuper, sub);
  };

  const GeoStatusBanner = () => {
    if (geoStatus === "idle") return null;

    const configs = {
      detecting: {
        icon: <Loader2 className="w-4 h-4 animate-spin" />,
        bg: "bg-blue-50 border-blue-200",
        text: "text-blue-700",
      },
      serviceable: {
        icon: <CheckCircle2 className="w-4 h-4" />,
        bg: "bg-green-50 border-green-200",
        text: "text-green-700",
      },
      unserviceable: {
        icon: <AlertCircle className="w-4 h-4" />,
        bg: "bg-orange-50 border-orange-200",
        text: "text-orange-700",
      },
      denied: {
        icon: <AlertCircle className="w-4 h-4" />,
        bg: "bg-red-50 border-red-200",
        text: "text-red-700",
      },
      error: {
        icon: <AlertCircle className="w-4 h-4" />,
        bg: "bg-red-50 border-red-200",
        text: "text-red-700",
      },
    };

    const cfg = configs[geoStatus as keyof typeof configs];
    if (!cfg) return null;

    return (
      <div className={`mx-4 mt-3 flex items-center gap-2 p-3 rounded-xl border text-sm ${cfg.bg} ${cfg.text}`}>
        {cfg.icon}
        <span>{geoMessage}</span>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closePicker} />
      <div className="relative bg-white w-full sm:max-w-sm rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 duration-200">

        {/* Header */}
        <div className="flex items-center gap-3 px-5 pt-5 pb-4 border-b border-border/30">
          {step === "sub" && (
            <button
              onClick={() => setStep("super")}
              className="p-1 rounded-full hover:bg-muted transition-colors"
              data-testid="button-location-back"
            >
              <ChevronLeft className="w-5 h-5 text-muted-foreground" />
            </button>
          )}
          <div className="flex items-center gap-2 flex-1">
            <MapPin className="w-5 h-5 text-primary" />
            <div>
              <h2 className="text-base font-bold text-foreground leading-tight">
                {step === "super" ? "Select your city" : `Areas in ${pickedSuper?.name}`}
              </h2>
              <p className="text-xs text-muted-foreground">
                {step === "super" ? "Where should we deliver?" : "Pick your delivery area"}
              </p>
            </div>
          </div>
          <button
            onClick={closePicker}
            className="p-1.5 rounded-full hover:bg-muted transition-colors text-muted-foreground"
            data-testid="button-location-close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Detect Location Button */}
        <div className="px-4 pt-3">
          <button
            onClick={handleDetectLocation}
            disabled={geoStatus === "detecting" || geoStatus === "serviceable"}
            data-testid="button-detect-location"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl border-2 border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/40 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {geoStatus === "detecting" ? (
              <Loader2 className="w-5 h-5 text-primary animate-spin shrink-0" />
            ) : (
              <Navigation className="w-5 h-5 text-primary shrink-0" />
            )}
            <div className="text-left">
              <p className="text-sm font-semibold text-primary leading-tight">
                {geoStatus === "detecting" ? "Detecting location..." : "Use current location"}
              </p>
              <p className="text-xs text-muted-foreground">
                Auto-detect & check serviceability
              </p>
            </div>
          </button>
        </div>

        {/* Geo Status Banner */}
        <GeoStatusBanner />

        {/* Divider */}
        <div className="flex items-center gap-3 px-4 mt-3">
          <div className="flex-1 h-px bg-border/40" />
          <span className="text-xs text-muted-foreground font-medium">or select manually</span>
          <div className="flex-1 h-px bg-border/40" />
        </div>

        {/* Content */}
        <div className="max-h-[45vh] overflow-y-auto p-4 pt-3">
          {step === "super" ? (
            loadingSuper ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-16 rounded-2xl bg-muted/50 animate-pulse" />
                ))}
              </div>
            ) : superHubs.length === 0 ? (
              <p className="text-center text-muted-foreground py-8 text-sm">No cities available</p>
            ) : (
              <div className="space-y-2.5">
                {superHubs.map(hub => (
                  <button
                    key={hub.id}
                    onClick={() => handleSuperSelect(hub)}
                    className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border transition-all text-left
                      ${selectedSuperHub?.id === hub.id
                        ? "border-primary/40 bg-primary/5"
                        : "border-border/40 hover:border-primary/30 hover:bg-muted/40"
                      }`}
                    data-testid={`button-super-hub-${hub.id}`}
                  >
                    {hub.imageUrl ? (
                      <img src={hub.imageUrl} alt={hub.name} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <MapPin className="w-6 h-6 text-primary" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground text-sm">{hub.name}</p>
                      {hub.location && <p className="text-xs text-muted-foreground truncate">{hub.location}</p>}
                    </div>
                    {selectedSuperHub?.id === hub.id && (
                      <Check className="w-4 h-4 text-primary shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            )
          ) : (
            loadingSub ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-14 rounded-2xl bg-muted/50 animate-pulse" />
                ))}
              </div>
            ) : subHubs.length === 0 ? (
              <p className="text-center text-muted-foreground py-8 text-sm">No areas available yet</p>
            ) : (
              <div className="space-y-2">
                {subHubs.map(sub => (
                  <button
                    key={sub.id}
                    onClick={() => handleSubSelect(sub)}
                    className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border transition-all text-left
                      ${selectedSubHub?.id === sub.id
                        ? "border-primary/40 bg-primary/5"
                        : "border-border/40 hover:border-primary/30 hover:bg-muted/40"
                      }`}
                    data-testid={`button-sub-hub-${sub.id}`}
                  >
                    {sub.imageUrl ? (
                      <img src={sub.imageUrl} alt={sub.name} className="w-10 h-10 rounded-xl object-cover shrink-0" />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground text-sm">{sub.name}</p>
                      {sub.location && <p className="text-xs text-muted-foreground truncate">{sub.location}</p>}
                      {sub.pincodes?.length > 0 && (
                        <p className="text-xs text-muted-foreground/70 mt-0.5">
                          Pincodes: {sub.pincodes.slice(0, 3).join(", ")}{sub.pincodes.length > 3 ? "..." : ""}
                        </p>
                      )}
                    </div>
                    {selectedSubHub?.id === sub.id && (
                      <Check className="w-4 h-4 text-primary shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
