

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddItemForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    SAP_ID: '',
    productName: '',
    Date: '',
    qr_code: '',
  });

  const [isModalOpen, setIsModalOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [fileName, setFileName] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    if (file.type !== 'application/pdf') {
      alert('Please upload a valid PDF file');
      return;
    }

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
    if (file.size > MAX_FILE_SIZE) {
      alert('File size exceeds the 5 MB limit. Please upload a smaller file.');
      return;
    }

    setFileName(file.name);

    try {
      const base64String = await toBase64(file);
      const trimmedBase64 = (base64String as string).replace(/^data:application\/pdf;base64,/, '');
      setFormData((prev) => ({ ...prev, qr_code: trimmedBase64 }));
    } catch (error) {
      console.error('Error converting file to Base64:', error);
    }
  };

  const toBase64 = (file: File): Promise<string | ArrayBuffer | null> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      if (!formData.qr_code) {
        setErrorMessage('Please upload a valid PDF file before submitting.');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/additem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccessMessage('Item added successfully!');
        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
      } else {
        setErrorMessage(result.message || 'Error adding item');
      }
    } catch (error: any) {
      setErrorMessage(`Error adding item: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
          <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-lg relative">
            <h1 className="text-2xl font-bold text-center mb-6">Add Item to Database</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col">
                <label htmlFor="SAP_ID" className="font-medium text-lg mb-1">SAP ID</label>
                <input
                  type="text"
                  id="SAP_ID"
                  value={formData.SAP_ID}
                  onChange={handleChange}
                  placeholder="Enter SAP ID"
                  className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="productName" className="font-medium text-lg mb-1">Product Name</label>
                <input
                  type="text"
                  id="productName"
                  value={formData.productName}
                  onChange={handleChange}
                  placeholder="Enter Product Name"
                  className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="Date" className="font-medium text-lg mb-1">Date</label>
                <input
                  type="date"
                  id="Date"
                  value={formData.Date}
                  onChange={handleChange}
                  className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="qr_code" className="font-medium text-lg mb-1">Leaflet PDF (QR Code)</label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {fileName && (
                  <p className="text-sm mt-1">
                    <strong>Uploaded File:</strong> {fileName}
                  </p>
                )}
              </div>

              {loading && <p className="text-blue-500">Submitting...</p>}
              {errorMessage && <p className="text-red-500">{errorMessage}</p>}
              {successMessage && <p className="text-green-500">{successMessage}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600 disabled:bg-gray-300"
              >
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            </form>

            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              X
            </button>
          </div>
        </div>
      )}
    </div>
  );
}








// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';

// export default function AddItemForm() {
//   const router = useRouter(); 

//   const [formData, setFormData] = useState({
//     SAP_ID: '',
//     productName: '',
//     Date: '',
//     qr_code: '', 
//   });

//   const [isModalOpen, setIsModalOpen] = useState(true); 
//   const [loading, setLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');
//   const [fileName, setFileName] = useState(''); 

  
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { id, value } = e.target;
//     setFormData((prev) => ({ ...prev, [id]: value }));
//   };

 
//   const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
//     const file = event.target.files?.[0];
//     if (!file) return;

    
//     if (file.type !== 'application/pdf') {
//       alert('Please upload a valid PDF file');
//       return;
//     }

   
//     const MAX_FILE_SIZE = 5 * 1024 * 1024; 
//     if (file.size > MAX_FILE_SIZE) {
//       alert('File size exceeds the 5 MB limit. Please upload a smaller file.');
//       return;
//     }

//     setFileName(file.name); 

//     try {
//       const base64String = await toBase64(file);
//       const trimmedBase64 = (base64String as string).replace(/^data:application\/pdf;base64,/, '');
//       setFormData((prev) => ({ ...prev, qr_code: trimmedBase64 })); 
//     } catch (error) {
//       console.error('Error converting file to Base64:', error);
//     }
//   };

 
//   const toBase64 = (file: File): Promise<string | ArrayBuffer | null> => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = () => resolve(reader.result);
//       reader.onerror = (error) => reject(error);
//     });
//   };

  
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setErrorMessage('');
//     setSuccessMessage('');

//     try {
     
//       if (!formData.qr_code) {
//         setErrorMessage('Please upload a valid PDF file before submitting.');
//         setLoading(false);
//         return;
//       }

//       const response = await fetch('/api/additem', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData),
//       });

//       const result = await response.json();

//       if (response.ok) {
//         setSuccessMessage('Item added successfully!');
//         setTimeout(() => {
//           router.push('/dashboard'); 
//         }, 1000); 
//       } else {
//         setErrorMessage(result.message || 'Error adding item');
//       }
//     } catch (error) {
//       setErrorMessage('Error adding item',);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
  
//   }, []);

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-100">
//       {isModalOpen && (
//         <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
//           <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-lg">
//             <h1 className="text-2xl font-bold text-center mb-6">Add Item to Database</h1>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div className="flex flex-col">
//                 <label htmlFor="SAP_ID" className="font-medium text-lg mb-1">SAP ID</label>
//                 <input
//                   type="text"
//                   id="SAP_ID"
//                   value={formData.SAP_ID}
//                   onChange={handleChange}
//                   placeholder="Enter SAP ID"
//                   className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               <div className="flex flex-col">
//                 <label htmlFor="productName" className="font-medium text-lg mb-1">Product Name</label>
//                 <input
//                   type="text"
//                   id="productName"
//                   value={formData.productName}
//                   onChange={handleChange}
//                   placeholder="Enter Product Name"
//                   className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               <div className="flex flex-col">
//                 <label htmlFor="Date" className="font-medium text-lg mb-1">Date</label>
//                 <input
//                   type="date"
//                   id="Date"
//                   value={formData.Date}
//                   onChange={handleChange}
//                   className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

          
//               <div className="flex flex-col">
//                 <label htmlFor="qr_code" className="font-medium text-lg mb-1">Leaflet PDF (QR Code)</label>
//                 <input
//                   type="file"
//                   accept=".pdf"
//                   onChange={handleFileChange}
//                   className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//                 {fileName && (
//                   <p className="text-sm mt-1">
//                     <strong>Uploaded File:</strong> {fileName}
//                   </p>
//                 )}
//               </div>

//               {loading && <p className="text-blue-500">Submitting...</p>}
//               {errorMessage && <p className="text-red-500">{errorMessage}</p>}
//               {successMessage && <p className="text-green-500">{successMessage}</p>}

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full py-2 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600 disabled:bg-gray-300"
//               >
//                 {loading ? 'Submitting...' : 'Submit'}
//               </button>
//             </form>

           
//             <button
//               onClick={() => setIsModalOpen(false)}
//               className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
//             >
//               X
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
