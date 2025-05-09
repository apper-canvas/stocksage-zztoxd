import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';

function MainFeature() {
  // Define all icons at the top of the component
  const PlusIcon = getIcon('Plus');
  const SearchIcon = getIcon('Search');
  const FilterIcon = getIcon('Filter');
  const EditIcon = getIcon('Edit');
  const Trash2Icon = getIcon('Trash2');
  const ArrowUpDownIcon = getIcon('ArrowUpDown');
  const XIcon = getIcon('X');
  const SaveIcon = getIcon('Save');
  const CheckIcon = getIcon('Check');
  const AlertTriangleIcon = getIcon('AlertTriangle');
  const PackageIcon = getIcon('Package');

  // State for inventory items
  const [inventory, setInventory] = useState([
    { id: 1, name: 'T-Shirt (Black)', sku: 'TS-BLK-001', category: 'Apparel', price: 19.99, currentStock: 45, minimumStock: 10, supplier: 'Fashion Wholesale Inc' },
    { id: 2, name: 'Coffee Mug', sku: 'HW-MUG-224', category: 'Homeware', price: 12.50, currentStock: 8, minimumStock: 15, supplier: 'Kitchen Supplies Co' },
    { id: 3, name: 'Wireless Earbuds', sku: 'TECH-EB-774', category: 'Electronics', price: 89.99, currentStock: 23, minimumStock: 5, supplier: 'Tech Distributors' },
    { id: 4, name: 'Yoga Mat', sku: 'FIT-YM-412', category: 'Fitness', price: 29.95, currentStock: 12, minimumStock: 8, supplier: 'Active Lifestyle Goods' },
    { id: 5, name: 'Protein Powder', sku: 'SUPP-PP-118', category: 'Supplements', price: 54.99, currentStock: 17, minimumStock: 10, supplier: 'Health Nutrition Inc' },
  ]);

  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [stockFilter, setStockFilter] = useState('all');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  // State for product form
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState('add'); // 'add' or 'edit'
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    price: '',
    currentStock: '',
    minimumStock: '',
    supplier: ''
  });
  const [formErrors, setFormErrors] = useState({});

  // Function to filter and sort inventory items
  const getFilteredInventory = () => {
    let filtered = [...inventory];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.supplier.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply category filter
    if (categoryFilter) {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }
    
    // Apply stock filter
    if (stockFilter === 'low') {
      filtered = filtered.filter(item => item.currentStock <= item.minimumStock);
    } else if (stockFilter === 'out') {
      filtered = filtered.filter(item => item.currentStock === 0);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let valueA = a[sortField];
      let valueB = b[sortField];
      
      // Convert to numbers for numerical sorts
      if (typeof valueA === 'string' && !isNaN(valueA)) {
        valueA = Number(valueA);
        valueB = Number(valueB);
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

  // Get unique categories for the filter dropdown
  const uniqueCategories = [...new Set(inventory.map(item => item.category))];
  const filteredInventory = getFilteredInventory();

  // Form handlers
  const openAddForm = () => {
    setFormData({
      name: '',
      sku: '',
      category: '',
      price: '',
      currentStock: '',
      minimumStock: '',
      supplier: ''
    });
    setFormErrors({});
    setFormMode('add');
    setIsFormOpen(true);
  };

  const openEditForm = (item) => {
    setFormData({
      id: item.id,
      name: item.name,
      sku: item.sku,
      category: item.category,
      price: item.price,
      currentStock: item.currentStock,
      minimumStock: item.minimumStock,
      supplier: item.supplier
    });
    setFormErrors({});
    setFormMode('edit');
    setIsFormOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Product name is required';
    if (!formData.sku.trim()) errors.sku = 'SKU is required';
    if (!formData.category.trim()) errors.category = 'Category is required';
    
    if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0) {
      errors.price = 'Price must be a positive number';
    }
    
    if (!formData.currentStock || isNaN(formData.currentStock) || Number(formData.currentStock) < 0) {
      errors.currentStock = 'Current stock must be a non-negative number';
    }
    
    if (!formData.minimumStock || isNaN(formData.minimumStock) || Number(formData.minimumStock) < 0) {
      errors.minimumStock = 'Minimum stock must be a non-negative number';
    }
    
    if (!formData.supplier.trim()) errors.supplier = 'Supplier is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the form errors');
      return;
    }
    
    // Process form data
    const newItem = {
      ...formData,
      price: Number(formData.price),
      currentStock: Number(formData.currentStock),
      minimumStock: Number(formData.minimumStock)
    };
    
    if (formMode === 'add') {
      // Add new item
      const newId = Math.max(...inventory.map(item => item.id), 0) + 1;
      const itemToAdd = { ...newItem, id: newId };
      setInventory([...inventory, itemToAdd]);
      toast.success('Product added successfully');
    } else {
      // Update existing item
      setInventory(inventory.map(item => 
        item.id === newItem.id ? newItem : item
      ));
      toast.success('Product updated successfully');
    }
    
    // Close form
    setIsFormOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setInventory(inventory.filter(item => item.id !== id));
      toast.success('Product deleted successfully');
    }
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

  // Update categories when inventory changes
  useEffect(() => {
    // No additional logic needed here at the moment
  }, [inventory]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Inventory Management</h2>
        <button 
          onClick={openAddForm}
          className="btn btn-primary flex items-center"
        >
          <PlusIcon size={18} className="mr-2" />
          Add Product
        </button>
      </div>
      
      {/* Filters and Search */}
      <div className="card neu-shadow space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-10"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400">
                <SearchIcon size={18} />
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="w-full sm:w-auto flex items-center gap-2">
              <div className="text-surface-500 dark:text-surface-400">
                <FilterIcon size={18} />
              </div>
              <select 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="form-input"
              >
                <option value="">All Categories</option>
                {uniqueCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div className="w-full sm:w-auto">
              <select 
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
                className="form-input"
              >
                <option value="all">All Stock</option>
                <option value="low">Low Stock</option>
                <option value="out">Out of Stock</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Inventory Table */}
      <div className="card neu-shadow overflow-x-auto">
        {filteredInventory.length > 0 ? (
          <table className="min-w-full">
            <thead className="bg-surface-100 dark:bg-surface-700">
              <tr>
                <th 
                  className="px-4 py-3 text-left text-sm font-medium text-surface-600 dark:text-surface-300 cursor-pointer"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center">
                    Product Name
                    {sortField === 'name' && (
                      <span className="ml-1">
                        <ArrowUpDownIcon size={14} />
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-sm font-medium text-surface-600 dark:text-surface-300 cursor-pointer"
                  onClick={() => handleSort('sku')}
                >
                  <div className="flex items-center">
                    SKU
                    {sortField === 'sku' && (
                      <span className="ml-1">
                        <ArrowUpDownIcon size={14} />
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-sm font-medium text-surface-600 dark:text-surface-300 cursor-pointer hidden md:table-cell"
                  onClick={() => handleSort('category')}
                >
                  <div className="flex items-center">
                    Category
                    {sortField === 'category' && (
                      <span className="ml-1">
                        <ArrowUpDownIcon size={14} />
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-right text-sm font-medium text-surface-600 dark:text-surface-300 cursor-pointer"
                  onClick={() => handleSort('price')}
                >
                  <div className="flex items-center justify-end">
                    Price
                    {sortField === 'price' && (
                      <span className="ml-1">
                        <ArrowUpDownIcon size={14} />
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-right text-sm font-medium text-surface-600 dark:text-surface-300 cursor-pointer"
                  onClick={() => handleSort('currentStock')}
                >
                  <div className="flex items-center justify-end">
                    Stock
                    {sortField === 'currentStock' && (
                      <span className="ml-1">
                        <ArrowUpDownIcon size={14} />
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-sm font-medium text-surface-600 dark:text-surface-300 cursor-pointer hidden lg:table-cell"
                  onClick={() => handleSort('supplier')}
                >
                  <div className="flex items-center">
                    Supplier
                    {sortField === 'supplier' && (
                      <span className="ml-1">
                        <ArrowUpDownIcon size={14} />
                      </span>
                    )}
                  </div>
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-surface-600 dark:text-surface-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-200 dark:divide-surface-700">
              {filteredInventory.map(item => (
                <tr key={item.id} className="hover:bg-surface-50 dark:hover:bg-surface-800/50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <div className="font-medium">{item.name}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-surface-600 dark:text-surface-400">
                    {item.sku}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-surface-600 dark:text-surface-400 hidden md:table-cell">
                    {item.category}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                    ${item.price.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.currentStock === 0 
                        ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400' 
                        : item.currentStock <= item.minimumStock 
                          ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400' 
                          : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                    }`}>
                      {item.currentStock}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-surface-600 dark:text-surface-400 hidden lg:table-cell">
                    {item.supplier}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                    <div className="flex justify-end space-x-2">
                      <button 
                        onClick={() => openEditForm(item)}
                        className="p-1 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        aria-label="Edit"
                      >
                        <EditIcon size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="p-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        aria-label="Delete"
                      >
                        <Trash2Icon size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="py-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-surface-100 dark:bg-surface-700 mb-4">
              <PackageIcon size={24} className="text-surface-500" />
            </div>
            <h3 className="text-lg font-medium mb-1">No Products Found</h3>
            <p className="text-surface-500 dark:text-surface-400 max-w-md mx-auto">
              {searchTerm || categoryFilter || stockFilter !== 'all'
                ? "No products match your current filters. Try adjusting your search criteria."
                : "Your inventory is empty. Add some products to get started."}
            </p>
          </div>
        )}
      </div>
      
      {/* Product Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setIsFormOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-white dark:bg-surface-800 rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center px-6 py-4 border-b border-surface-200 dark:border-surface-700">
                <h3 className="text-xl font-bold">
                  {formMode === 'add' ? 'Add New Product' : 'Edit Product'}
                </h3>
                <button 
                  onClick={() => setIsFormOpen(false)}
                  className="p-1 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
                  aria-label="Close"
                >
                  <XIcon size={20} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label htmlFor="name" className="form-label">Product Name</label>
                  <input 
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`form-input ${formErrors.name ? 'border-red-500 dark:border-red-500' : ''}`}
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="sku" className="form-label">SKU</label>
                  <input 
                    type="text"
                    id="sku"
                    name="sku"
                    value={formData.sku}
                    onChange={handleInputChange}
                    className={`form-input ${formErrors.sku ? 'border-red-500 dark:border-red-500' : ''}`}
                  />
                  {formErrors.sku && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.sku}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="category" className="form-label">Category</label>
                  <input 
                    type="text"
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className={`form-input ${formErrors.category ? 'border-red-500 dark:border-red-500' : ''}`}
                    list="categories"
                  />
                  <datalist id="categories">
                    {uniqueCategories.map(category => (
                      <option key={category} value={category} />
                    ))}
                  </datalist>
                  {formErrors.category && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.category}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="price" className="form-label">Price</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-500">$</span>
                      <input 
                        type="text"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className={`form-input pl-7 ${formErrors.price ? 'border-red-500 dark:border-red-500' : ''}`}
                      />
                    </div>
                    {formErrors.price && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.price}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="currentStock" className="form-label">Current Stock</label>
                    <input 
                      type="number"
                      id="currentStock"
                      name="currentStock"
                      value={formData.currentStock}
                      onChange={handleInputChange}
                      className={`form-input ${formErrors.currentStock ? 'border-red-500 dark:border-red-500' : ''}`}
                    />
                    {formErrors.currentStock && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.currentStock}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="minimumStock" className="form-label">Minimum Stock Level</label>
                  <input 
                    type="number"
                    id="minimumStock"
                    name="minimumStock"
                    value={formData.minimumStock}
                    onChange={handleInputChange}
                    className={`form-input ${formErrors.minimumStock ? 'border-red-500 dark:border-red-500' : ''}`}
                  />
                  {formErrors.minimumStock && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.minimumStock}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="supplier" className="form-label">Supplier</label>
                  <input 
                    type="text"
                    id="supplier"
                    name="supplier"
                    value={formData.supplier}
                    onChange={handleInputChange}
                    className={`form-input ${formErrors.supplier ? 'border-red-500 dark:border-red-500' : ''}`}
                  />
                  {formErrors.supplier && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.supplier}</p>
                  )}
                </div>
                
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary flex items-center"
                  >
                    {formMode === 'add' ? (
                      <>
                        <SaveIcon size={18} className="mr-2" />
                        Save Product
                      </>
                    ) : (
                      <>
                        <CheckIcon size={18} className="mr-2" />
                        Update Product
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Low Stock Warning */}
      {inventory.some(item => item.currentStock <= item.minimumStock) && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card neu-shadow bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500"
        >
          <div className="flex items-start gap-4">
            <div className="text-amber-500 mt-1">
              <AlertTriangleIcon size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-400">Low Stock Alert</h3>
              <p className="text-amber-700 dark:text-amber-300 mt-1">
                Some products are below their minimum stock level. Consider reordering soon.
              </p>
              <ul className="mt-2 space-y-1">
                {inventory
                  .filter(item => item.currentStock <= item.minimumStock)
                  .slice(0, 3)
                  .map(item => (
                    <li key={item.id} className="text-sm text-amber-700 dark:text-amber-300 flex justify-between">
                      <span>{item.name}</span>
                      <span className="font-medium">{item.currentStock} in stock</span>
                    </li>
                  ))}
                {inventory.filter(item => item.currentStock <= item.minimumStock).length > 3 && (
                  <li className="text-sm text-amber-700 dark:text-amber-300 italic">
                    And {inventory.filter(item => item.currentStock <= item.minimumStock).length - 3} more...
                  </li>
                )}
              </ul>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default MainFeature;