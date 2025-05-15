import React from 'react';
import { motion } from 'framer-motion';
import { Pill, Search, Filter, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Medicine = () => {
  const navigate = useNavigate();

  const medicines = [
    {
      name: "Paracetamol",
      description: "Common pain reliever and fever reducer. Effective for headaches, muscle aches, and reducing fever.",
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80",
      stock: true,
      dosage: "500mg",
      price: "$5.99"
    },
    {
      name: "Amoxicillin",
      description: "Antibiotic used to treat various bacterial infections. Requires prescription from a healthcare provider.",
      image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=800&q=80",
      stock: true,
      dosage: "250mg",
      price: "$12.99"
    },
    {
      name: "Ibuprofen",
      description: "Anti-inflammatory medication used for pain relief and reducing fever. Effective for joint pain and inflammation.",
      image: "https://images.unsplash.com/photo-1550572017-edd951aa8f7e?auto=format&fit=crop&w=800&q=80",
      stock: true,
      dosage: "400mg",
      price: "$7.99"
    },
    {
      name: "Omeprazole",
      description: "Proton pump inhibitor used to treat acid reflux and heartburn. Reduces stomach acid production.",
      image: "https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&w=800&q=80",
      stock: false,
      dosage: "20mg",
      price: "$15.99"
    },
    {
      name: "Cetirizine",
      description: "Antihistamine used to relieve allergy symptoms such as sneezing, runny nose, and itchy eyes.",
      image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=800&q=80",
      stock: true,
      dosage: "10mg",
      price: "$8.99"
    },
    {
      name: "Vitamin D3",
      description: "Essential vitamin supplement for bone health and immune system support. Recommended for daily use.",
      image: "https://images.unsplash.com/photo-1577401239170-897942555fb3?auto=format&fit=crop&w=800&q=80",
      stock: true,
      dosage: "1000IU",
      price: "$10.99"
    }
  ];

  return (
    <div className="min-h-screen pt-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Pill className="w-8 h-8 text-green-500" />
            Medicine Information
          </h1>
          <div className="flex gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search medicines..."
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              <Filter className="w-5 h-5" />
              Filter
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {medicines.map((medicine, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <img 
                src={medicine.image} 
                alt={medicine.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{medicine.name}</h3>
                  <span className={`px-3 py-1 text-sm rounded-full ${medicine.stock ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400' : 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400'}`}>
                    {medicine.stock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {medicine.description}
                </p>
                <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                  <span>Dosage: {medicine.dosage}</span>
                  <span>Price: {medicine.price}</span>
                </div>
                <button
                  onClick={() => navigate('/medicine-description')}
                  className="mt-4 w-full flex items-center justify-center gap-2 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  View Details
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Medicine;