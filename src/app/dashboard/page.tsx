



"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaProductHunt, FaPlus, FaSignOutAlt } from 'react-icons/fa';
import Logout from '../logout/page';


interface Product {
  ID: string;
  SAP_ID: string;
  productName: string;
  qr_code?: string; 
  Date: string; 
}

export default function Dashboard() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<Product>({
    ID: '',
    SAP_ID: '',
    productName: '',
    qr_code: '',
    Date: '',
  });
  const [fileName, setFileName] = useState<string>(''); // File name for PDF upload

  const isLoggedIn = typeof window !== 'undefined' && localStorage.getItem('token') !== null;

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    } else {
      async function fetchProducts() {
        try {
          const response = await fetch('/api/posts');
          if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.statusText}`);
          }
          const data = await response.json();
          if (data && Array.isArray(data)) {
            setProducts(data);
          } else {
            throw new Error("Unexpected data format");
          }
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
      fetchProducts();
    }
  }, [isLoggedIn, router]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const openModal = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      ...product,
      Date: formatDate(product.Date), 
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = event.target.files?.[0];
    if (!file) return;

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
      setFormData({ ...formData, qr_code: trimmedBase64 }); 
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

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/posts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Failed to update: ${response.statusText}`);
      }

      const result = await response.json();
      if (result.error) {
        throw new Error(result.error);
      }

      setProducts(prevProducts =>
        prevProducts.map(product =>
          product.ID === formData.ID ? formData : product
        )
      );
      closeModal(); 
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex text-black flex-col lg:flex-row min-h-screen bg-gray-100">
      <aside className="w-full lg:w-64 bg-blue-800 text-white lg:min-h-screen flex flex-col items-center lg:items-start p-4">
        <h1 className="text-2xl font-semibold pl-4 mb-8 lg:pl-20">ADMIN</h1>
        <nav className="w-full lg:w-auto">
          <ul className="flex flex-col w-full lg:text-end">
            <li className="p-3 text-sm flex items-center hover:bg-blue-700 cursor-pointer rounded-lg mb-3">
              <FaProductHunt className="mr-3 text-lg" />
              Products
            </li>
            <Link href="./additem">
              <li className="p-3 text-sm flex items-center hover:bg-blue-700 cursor-pointer rounded-lg mb-3">
                <FaPlus className="mr-3 text-lg" />
                Add Item
              </li>
            </Link>
            <Link href="./login">
              <li className="p-3 text-sm flex items-center hover:bg-red-500 cursor-pointer rounded-lg mb-3 bottom-4">
                <FaSignOutAlt className="mr-3 text-lg" />
                <Logout />
              </li>
            </Link>
          </ul>
        </nav>
      </aside>

      <div className="flex-1">
        <header className="bg-white shadow p-2 flex flex-wrap justify-center lg:justify-between items-center">
          <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500  p-6 rounded-3xl transform hover:scale-105 transition-transform duration-300 ease-in-out">
            SJG Leaflet QR Code Dashboard
          </h1>
          <button onClick={() => router.push('./generatecode')} className="bg-blue-700 flex hover:bg-blue-500 text-white p-2 rounded-lg w-full sm:w-auto">
            Generate QR Code
          </button>
        </header>

        <main className="p-2 lg:p-4">
          <h1 className="text-xl font-semibold text-gray-700 text-center mb-4">Products</h1>
          <div className="overflow-auto bg-white shadow rounded-lg p-2 lg:p-4">
            <table className="min-w-full text-xs lg:text-sm text-center">
              <thead>
                <tr>
                  <th className="px-2 py-1">ID</th>
                  <th className="px-2 py-1">SAP ID</th>
                  <th className="px-2 py-1">Product Name</th>
                  <th className="px-2 py-1">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-2 py-1">{product.ID}</td>
                    <td className="px-2 py-1">{product.SAP_ID}</td>
                    <td className="px-2 py-1">{product.productName}</td>
                    <td className="px-2 py-1 flex flex-col justify-center items-center space-y-1 sm:flex-row sm:space-y-0 sm:space-x-2">
                      <button
                        onClick={() => openModal(product)}
                        className="bg-green-500 text-white px-4 py-1 rounded-md hover:bg-green-600"
                      >
                        Update
                      </button>

                    
                      <button
                        onClick={() => router.push(`/leaflet?id=${product.ID}`)}
                        className="bg-green-500 text-white px-2 py-1 rounded text-xs"
                      >
                        View
                      </button>

                    
                      <button
                        className="bg-yellow-500 text-white px-2 py-1 rounded text-xs"
                        onClick={() => {
                          window.location.href = `/download?id=${product.ID},${product.productName}`;
                        }}
                      >
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>


        {isModalOpen && selectedProduct && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-96">
              <h2 className="text-xl font-semibold mb-4">Update Product</h2>
              <form onSubmit={handleUpdateProduct} className="space-y-4">
                <div>
                  <label htmlFor="SAPID" className="block text-sm">SAP ID</label>
                  <input
                    type="number"
                    id="SAP_ID"
                    name="SAP_ID"
                    value={formData.SAP_ID}
                    onChange={handleInputChange}
                    className="w-full border rounded p-2 mt-1"
                    required
                  />
                </div>


                <div>
                  <label htmlFor="productName" className="block text-sm">Product Name</label>
                  <input
                    type="text"
                    id="productName"
                    name="productName"
                    value={formData.productName}
                    onChange={handleInputChange}
                    className="w-full border rounded p-2 mt-1"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="Date" className="block text-sm">Date</label>
                  <input
                    type="date"
                    id="Date"
                    name="Date"
                    value={formData.Date}
                    onChange={handleInputChange}
                    className="w-full border rounded p-2 mt-1"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="qr_code" className="block text-sm">Upload PDF</label>
                  <input
                    type="file"
                    id="qr_code"
                    name="qr_code"
                    onChange={handleFileChange}
                    accept="application/pdf"
                    className="w-full border rounded p-2 mt-1"
                  />
                  {fileName && <p className="text-sm mt-2">Selected file: {fileName}</p>}
                </div>
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="bg-gray-400 text-white px-4 py-1 rounded-md hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-blue-600"
                  >
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
