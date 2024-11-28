       'use client'
        import { useState } from 'react'
        import QRCode from 'qrcode'
        import Image from 'next/image'

        export default function GenerateCode() {
        const [url, setUrl] = useState('')
        const [qrcode, setQrCode] = useState('')

        const generateQrCode = () => {
        QRCode.toDataURL(url, (err, url) => {
        if (err) return console.error(err)
        console.log(url)
        setQrCode(url)
        })
        }
        return (
        <div className="flex flex-col items-center justify-center min-h-screen p-8 pb-20 bg-gray-100 gap-8 sm:p-20 font-sans">
        <h1 className="text-3xl font-bold text-gray-800">Generate QR Code</h1>

        <input
        className="w-full max-w-md p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        type="text"
        placeholder="Enter URL or text to generate QR Code"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        />

        <div className="text-box">
        <a
          href="#"
          onClick={generateQrCode}
          className="inline-block px-6 py-3 mt-4 text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-500 transition duration-200"
        >
          Generate
        </a>
        </div>

        {qrcode && (
        <div className="flex flex-col items-center mt-8">
        <Image className="qrCode mb-4" src={qrcode} width={100} height={100} alt="Generated QR Code" />
        <a
           className="text-blue-600 hover:underline"
           href={qrcode}
           download="qrCode.png"
          >
            Download QR Code
          </a>
        </div>
         )}
        </div>

        )}

