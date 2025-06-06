// src/app/page.tsx
"use client";

import { useEffect, useState } from "react";

// We'll dynamically load these modules only in the browser:
import type OAuthInfoType from "@arcgis/core/identity/OAuthInfo";
import type IdentityManagerType from "@arcgis/core/identity/IdentityManager";
import type PortalType from "@arcgis/core/portal/Portal";

// Our ArcGISMap component (renders a simple map once authenticated)
import ArcGISMap from "./components/ArcGISMap";

interface UserInfo {
  fullName: string;
  username: string;
}

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  // Read environment variables (Next.js exposes NEXT_PUBLIC_ prefixed vars)
  const portalUrl = process.env.NEXT_PUBLIC_ARCGIS_PORTAL_URL || "";
  const appId = process.env.NEXT_PUBLIC_ARCGIS_APP_ID || "";

  useEffect(() => {
    // Only run on client
    async function initArcGISAuth() {
      if (!portalUrl || !appId) {
        console.error("Missing NEXT_PUBLIC_ARCGIS_PORTAL_URL or NEXT_PUBLIC_ARCGIS_APP_ID");
        setLoading(false);
        return;
      }

      // Dynamically import ArcGIS Identity modules:
      const [{ default: OAuthInfo }, { default: IdentityManager }, { default: Portal }] = await Promise.all([
        import("@arcgis/core/identity/OAuthInfo"),
        import("@arcgis/core/identity/IdentityManager"),
        import("@arcgis/core/portal/Portal")
      ]) as [
        { default: typeof OAuthInfoType },
        { default: typeof IdentityManagerType },
        { default: typeof PortalType }
      ];

      // 1. Create and register OAuthInfo
      const oauthInfo = new OAuthInfo({
        appId: appId,
        portalUrl: portalUrl,
        // 'flowType: "auto"' is default; for ArcGIS Enterprise 10.9.1,
        // it will choose one-step or two-step automatically.
        flowType: "auto"
      });
      IdentityManager.registerOAuthInfos([oauthInfo]);

      // 2. Check if already signed in:
      try {
        await IdentityManager.checkSignInStatus(`${portalUrl}/sharing`);
        // Already signed in! Retrieve portal user info
        const portal = new Portal({
          authMode: "immediate",
          url: portalUrl
        });
        await portal.load();
        if (portal.user) {
          setUserInfo({
            fullName: portal.user.fullName ?? 'Unknown User',
            username: portal.user.username ?? 'unknown'
          });
          setIsAuthenticated(true);
        }
      } catch (error) {
        // Not signed in yet
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    }

    initArcGISAuth();
  }, [portalUrl, appId]);

  // Trigger the OAuth redirect to sign in:
  const handleSignIn = async () => {
    if (!portalUrl) return;
    // Dynamically import IdentityManager so we can call getCredential
    const { default: IdentityManager } = await import("@arcgis/core/identity/IdentityManager");

    // This will redirect the user to your portal's OAuth sign-in page
    IdentityManager.getCredential(`${portalUrl}/sharing`);
  };

  const handleSignOut = async () => {
    // Dynamically import IdentityManager to destroy credentials
    const { default: IdentityManager } = await import("@arcgis/core/identity/IdentityManager");
    IdentityManager.destroyCredentials();
    setIsAuthenticated(false);
    setUserInfo(null);
  };

  if (loading) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Sign In to ArcGIS Enterprise</h2>
        <button
          onClick={handleSignIn}
          style={{
            padding: "10px 20px",
            fontSize: "1rem",
            cursor: "pointer",
            borderRadius: 4,
            backgroundColor: "#0079c1",
            color: "#fff",
            border: "none"
          }}
        >
          Sign In
        </button>
      </div>
    );
  }

  // If we reach here, the user is signed in.
  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 20px",
          backgroundColor: "#f5f5f5",
          borderBottom: "1px solid #ddd"
        }}
      >
        <div>
          <strong>Welcome, {userInfo?.fullName} (@{userInfo?.username})</strong>
        </div>
        <button
          onClick={handleSignOut}
          style={{
            padding: "6px 12px",
            fontSize: "0.9rem",
            cursor: "pointer",
            borderRadius: 4,
            backgroundColor: "#d9534f",
            color: "#fff",
            border: "none"
          }}
        >
          Sign Out
        </button>
      </header>

      {/* Once signed in, show the map */}
      <div style={{ height: "calc(100vh - 60px)" }}>
        <ArcGISMap portalUrl={portalUrl} />
      </div>
    </div>
  );
}
