'use client'
import { useEffect } from "react";

export default function Download() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('id') || '0');

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

        const link = document.createElement("a");
        link.href = `data:application/pdf;base64,${base64String}`;
        link.download = "example.pdf";
        const check = response
        console.log(check)
        console.log("check")
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };

    if (id) {
      fetchData(id);
    }
  }, []);

  return (
    <>

    </>
  );

}


