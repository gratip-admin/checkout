"use client";
import { useState, useEffect } from "react";

export default function useGetCountryCode() {
  const [countryCode, setCountryCode] = useState<string>("");

  useEffect(() => {
    const getCountryCode = async () => {
      try {
        // Primary: ipapi.co
        const response = await fetch("https://ipapi.co/country/");
        if (response.ok) {
          const countryCode = await response.text();
          if (
            countryCode &&
            countryCode.length === 2 &&
            !/error|html/i.test(countryCode)
          ) {
            setCountryCode(countryCode.toUpperCase());
            return;
          }
        }
      } catch (error) {
        console.warn("Primary country API failed:", error);
      }

      try {
        // Fallback 1: ipinfo.io
        const response = await fetch("https://ipinfo.io/json");
        if (response.ok) {
          const data = await response.json();
          if (data.country && data.country.length === 2) {
            setCountryCode(data.country.toUpperCase());
            return;
          }
        }
      } catch (error) {
        console.warn("Fallback 1 country API failed:", error);
      }

      try {
        // Fallback 2: ip-api.com
        const response = await fetch(
          "https://ip-api.com/json/?fields=countryCode"
        );
        if (response.ok) {
          const data = await response.json();
          if (data.countryCode && data.countryCode.length === 2) {
            setCountryCode(data.countryCode.toUpperCase());
            return;
          }
        }
      } catch (error) {
        console.warn("Fallback 2 country API failed:", error);
      }

      try {
        // Fallback 3: httpbin.org (returns IP, then we can use another service)
        const response = await fetch("https://httpbin.org/ip");
        if (response.ok) {
          const data = await response.json();
          if (data.origin) {
            // Use the IP with a different service
            const geoResponse = await fetch(
              `https://get.geojs.io/v1/ip/country/${data.origin}.json`
            );
            if (geoResponse.ok) {
              const geoData = await geoResponse.json();
              if (geoData.country && geoData.country.length === 2) {
                setCountryCode(geoData.country.toUpperCase());
                return;
              }
            }
          }
        }
      } catch (error) {
        console.warn("Fallback 3 country API failed:", error);
      }

      // Final fallback: Use browser locale
      try {
        const locale = navigator.language || navigator.languages?.[0];
        if (locale && locale.includes("-")) {
          const countryFromLocale = locale.split("-")[1].toUpperCase();
          if (countryFromLocale && countryFromLocale.length === 2) {
            setCountryCode(countryFromLocale);
            console.warn(
              "Using browser locale for country code:",
              countryFromLocale
            );
            return;
          }
        }
      } catch (error) {
        console.warn("Browser locale fallback failed:", error);
      }

      // Ultimate fallback: Default to GB (United Kingdom)
      console.warn("All country detection methods failed, defaulting to GB");
      setCountryCode("NG");
    };

    getCountryCode();
  }, []);

  return { countryCode };
}
