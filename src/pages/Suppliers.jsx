import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import getIcon from '../utils/iconUtils';
import SupplierForm from '../components/SupplierForm';
import SupplierDetails from '../components/SupplierDetails';

function Suppliers() {
  const navigate = useNavigate();
  
  // Icons
  const PlusIcon = getIcon('Plus');
  const SearchIcon = getIcon('Search');
  const ArrowUpDownIcon = getIcon('ArrowUpDown');
  const HomeIcon = getIcon('Home');
  const EditIcon = getIcon('Edit');
  const Trash2Icon = getIcon('Trash2');
  const InfoIcon = getIcon('Info');
  const BuildingIcon = getIcon('Building2');
  
  // Sample suppliers data
  const [suppliers, setSuppliers] = useState([
    { 
      id: 1, 
      name: 'Fashion Wholesale Inc', 
      contactName: 'Sarah Johnson',
      email: 'sarah@fashionwholesale.com',
      phone: '(555) 123-4567',
      address: '123 Fashion Ave, New York, NY 10001',
      category: 'Apparel',
      status: 'active',
      paymentTerms: 'Net 30',
      website: 'www.fashionwholesale.com',
      notes: 'Preferred supplier for all apparel products',
      products: ['T-Shirt (Black)', 'T-Shirt (White)', 'Denim Jeans']
    },
    { 
      id: 2, 
      name: 'Kitchen Supplies Co', 
      contactName: 'Miguel Rodriguez',
      email: 'miguel@kitchensupplies.com',
      phone: '(555) 234-5678',
      address: '456 Culinary Blvd, Chicago, IL 60607',
      category: 'Homeware',
      status: 'active',
      paymentTerms: 'Net 45',
      website: 'www.kitchensupplies.com',
      notes: 'Bulk discounts available for orders over $1000',
      products: ['Coffee Mug', 'Kitchen Knife Set', 'Cutting Board']
    },
    { 
      id: 3, 
      name: 'Tech Distributors', 
      contactName: 'Lisa Chen',
      email: 'lisa@techdist.com',
      phone: '(555) 345-6789',
      address: '789 Tech Way, San Jose, CA 95110',
      category: 'Electronics',
      status: 'active',
      paymentTerms: 'Net 15',
      website: 'www.techdistributors.com',
      notes: 'Provides 2-year warranty on all electronics',
      products: ['Wireless Earbuds', 'Power Bank', 'USB-C Cable']
    },
    { 
      id: 4, 
      name: 'Active Lifestyle Goods', 
      contactName: 'Jordan Smith',
      email: 'jordan@activelifestyle.com',
      phone: '(555) 456-7890',
      address: '101 Fitness Road, Boulder, CO 80301',
      category: 'Fitness',
      status: 'inactive',
      paymentTerms: 'Net 30',
      website: 'www.activelifestylegoods.com',
      notes: 'Currently experiencing shipping delays due to material shortages',
      products: ['Yoga Mat', 'Resistance Bands', 'Water Bottle']
    },
    { 
      id: 5, 
      name: 'Health Nutrition Inc', 
      contactName: 'David Kim',
      email: 'david@healthnutrition.com',
      phone: '(555) 567-8901',
      address: '202 Wellness Ave, Portland, OR 97205',
      category: 'Supplements',
      status: 'active',
      paymentTerms: 'Net 60',
      website: 'www.healthnutritioninc.com',
      notes: 'Certified organic ingredients, requires 1 week notice for large orders',
      products: ['Protein Powder', 'Vitamin C Supplements', 'Fish Oil']
    },
  ]);

  // State for search, sort, and modals
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState('add'); // 'add' or 'edit'
  const [currentSupplier, setCurrentSupplier] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  // Get filtered and sorted suppliers
  const getFilteredSuppliers = () => {
    let filtered = [...suppliers];
    
    // Apply search filter
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(supplier => 
        supplier.name.toLowerCase().includes(lowerSearch) ||
        supplier.contactName.toLowerCase().includes(lowerSearch) ||
        supplier.email.toLowerCase().includes(lowerSearch) ||
        supplier.category.toLowerCase().includes(lowerSearch)
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let valueA = a[sortField];
      let valueB = b[sortField];
      
      // Handle string conversion if needed
      if (typeof valueA === 'string') {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();
      }
      
      if (valueA < valueB) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
    
    return filtered;
  };

  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Form handlers
  const handleAddSupplier = () => {
    setFormMode('add');
    setCurrentSupplier(null);
    setFormOpen(true);
  };

  const handleEditSupplier = (supplier) => {
    setFormMode('edit');
    setCurrentSupplier(supplier);
    setFormOpen(true);
  };

  const handleDeleteSupplier = (id) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      setSuppliers(suppliers.filter(supplier => supplier.id !== id));
      toast.success('Supplier deleted successfully');
    }
  };

  const handleViewDetails = (supplier) => {
    setSelectedSupplier(supplier);
    setDetailsOpen(true);
  };

  const handleSaveSupplier = (supplierData) => {
    if (formMode === 'add') {
      const newId = Math.max(...suppliers.map(s => s.id), 0) + 1;
      const newSupplier = { ...supplierData, id: newId };
      setSuppliers([...suppliers, newSupplier]);
      toast.success('Supplier added successfully');
    } else {
      setSuppliers(suppliers.map(s => s.id === supplierData.id ? supplierData : s));
      toast.success('Supplier updated successfully');
    }
    setFormOpen(false);
  };

  const filteredSuppliers = getFilteredSuppliers();
  
  return (
    <div className="space-y-6">
      {/* Header with breadcrumb */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2 text-sm text-surface-500 dark:text-surface-400 mb-2">
            <button onClick={() => navigate('/')} className="hover:text-primary flex items-center">
              <HomeIcon size={14} className="mr-1" />
              <span>Home</span>
            </button>
            <span>/</span>
            <span className="text-surface-800 dark:text-surface-200">Suppliers</span>
          </div>
          <h1 className="text-2xl font-bold flex items-center">
            <BuildingIcon className="mr-2" size={24} />
            Supplier Management
          </h1>
        </div>
        <button 
          onClick={handleAddSupplier}
          className="btn btn-primary flex items-center"
        >
          <PlusIcon size={18} className="mr-2" />
          Add Supplier
        </button>
      </div>
      
      {/* Search */}
      <div className="card neu-shadow">
        <div className="relative">
          <input
            type="text"
            placeholder="Search suppliers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input pl-10"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400">
            <SearchIcon size={18} />
          </div>
        </div>
      </div>
      
      {/* Suppliers Table */}
      <div className="card neu-shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-surface-100 dark:bg-surface-700">
            <tr>
              <th 
                className="px-4 py-3 text-left text-sm font-medium text-surface-600 dark:text-surface-300 cursor-pointer"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center">
                  Name
                  {sortField === 'name' && (
                    <span className="ml-1"><ArrowUpDownIcon size={14} /></span>
                  )}
                </div>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-surface-600 dark:text-surface-300 hidden md:table-cell">Contact</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-surface-600 dark:text-surface-300 hidden lg:table-cell">Email</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-surface-600 dark:text-surface-300">Category</th>
              <th 
                className="px-4 py-3 text-left text-sm font-medium text-surface-600 dark:text-surface-300 cursor-pointer"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center">
                  Status
                  {sortField === 'status' && (
                    <span className="ml-1"><ArrowUpDownIcon size={14} /></span>
                  )}
                </div>
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-surface-600 dark:text-surface-300">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-200 dark:divide-surface-700">
            {filteredSuppliers.map(supplier => (
              <tr key={supplier.id} className="hover:bg-surface-50 dark:hover:bg-surface-800/50">
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">{supplier.name}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-surface-600 dark:text-surface-400 hidden md:table-cell">{supplier.contactName}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-surface-600 dark:text-surface-400 hidden lg:table-cell">{supplier.email}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-surface-600 dark:text-surface-400">{supplier.category}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    supplier.status === 'active' 
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                      : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
                  }`}>
                    {supplier.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                  <div className="flex justify-end space-x-2">
                    <button onClick={() => handleViewDetails(supplier)} className="p-1 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                      <InfoIcon size={18} />
                    </button>
                    <button onClick={() => handleEditSupplier(supplier)} className="p-1 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                      <EditIcon size={18} />
                    </button>
                    <button onClick={() => handleDeleteSupplier(supplier.id)} className="p-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                      <Trash2Icon size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Supplier Form Modal */}
      <AnimatePresence>
        {formOpen && (
          <SupplierForm 
            mode={formMode}
            supplier={currentSupplier}
            onSave={handleSaveSupplier}
            onCancel={() => setFormOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Supplier Details Modal */}
      <AnimatePresence>
        {detailsOpen && selectedSupplier && (
          <SupplierDetails
            supplier={selectedSupplier}
            onClose={() => setDetailsOpen(false)}
            onEdit={() => {
              setDetailsOpen(false);
              handleEditSupplier(selectedSupplier);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default Suppliers;