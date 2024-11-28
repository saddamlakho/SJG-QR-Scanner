'use client'
import { useEffect } from "react";

import qrImage from '../leaflet/sjg-qr.png'
import Image from "next/image";
export default function Test() {

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get("id") || "0");

    const fetchData = async (id: number) => {
      try {
        console.log(`Fetching data for ID: ${id}`);
        const data = await fetch(`/api/posts?id=${id}`);

        if (!data.ok) {
          throw new Error(`Error fetching data: ${data.statusText}`);
        }

        const response = await data.json();
        console.log("Full response:", response);
        const base64String = response.qr_code || response[0]?.qr_code;

        if (!base64String) {
          console.log("QR code not found in response");
          return;
        }

        const pdfDataUrl = `data:application/pdf;base64,${base64String}`;


        const newTab = window.open();
        if (newTab) {
          newTab.document.write(
            `<iframe src="${pdfDataUrl}" width="100%" height="100%"></iframe>`
          );
        } else {
          console.log("Failed to open new tab");
        }



      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };

    if (id) {
      fetchData(id);
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-blue-600 mb-2">
        SJG Fazul Ellahi PVT LTD
      </h1>


      <Image src={qrImage} alt="QR Code" width={120} height={120} />

    </div>

  )
}
