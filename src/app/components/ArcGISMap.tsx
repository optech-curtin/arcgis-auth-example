"use client";

import { useEffect, useRef } from "react";

interface ArcGISMapProps {
  portalUrl: string;
}

/**
 * ArcGISMap
 *
 * Once the user is authenticated, this component will load a WebMap from your
 * Enterprise Portal and display it in a MapView.
 *
 * Replace `YOUR_WEBMAP_ITEM_ID` with the portalItem ID of your WebMap.
 */
export default function ArcGISMap({ portalUrl }: ArcGISMapProps) {
  const mapDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let view: __esri.MapView | null = null;

    async function initializeWebMap() {
      // Dynamically import only the modules we need, in the browser:
      const [
        { default: WebMap },
        { default: MapView },
        { default: PortalItem },
        { default: Portal }
      ] = await Promise.all([
        import("@arcgis/core/WebMap"),
        import("@arcgis/core/views/MapView"),
        import("@arcgis/core/portal/PortalItem"),
        import("@arcgis/core/portal/Portal")
      ]);

      // 1. Create a Portal instance pointing at your Enterprise portal
      const portal = new Portal({
        url: portalUrl
      });

      // 2. Create a PortalItem for the WebMap (replace with your item ID)
      const webmapItem = new PortalItem({
        id: "34e3e14cea754a41a9b7f8455fef8c48",
        portal: portal
      });

      // 3. Create the WebMap using that PortalItem
      const webmap = new WebMap({
        portalItem: webmapItem
      });

      // 4. Create the MapView and attach it to our container
      view = new MapView({
        container: mapDivRef.current || undefined,
        map: webmap,
        // Optionally set a default center/zoom that will be overridden
        // by the WebMap’s saved extent as soon as it loads.
        center: [0, 0],
        zoom: 2
      });
    }

    initializeWebMap();

    return () => {
      if (view) {
        view.destroy();
        view = null;
      }
    };
  }, [portalUrl]);

  return (
    <div
      ref={mapDivRef}
      style={{
        width: "100%",
        height: "100%"
      }}
    />
  );
}
