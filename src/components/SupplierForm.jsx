import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';

function SupplierForm({ mode, supplier, onSave, onCancel }) {
  // Icons
  const XIcon = getIcon('X');
  const SaveIcon = getIcon('Save');
  const CheckIcon = getIcon('Check');

  // Initialize form data
  const [formData, setFormData] = useState({
    id: supplier?.id || null,
    name: '',
    contactName: '',
    email: '',
    phone: '',
    address: '',
    category: '',
    status: 'active',
    paymentTerms: '',
    website: '',
    notes: '',
    products: []
  });

  // Form validation
  const [formErrors, setFormErrors] = useState({});

  // Load supplier data if editing
  useEffect(() => {
    if (mode === 'edit' && supplier) {
      setFormData({ ...supplier });
    }
  }, [mode, supplier]);

  // Handle input changes
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

  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) errors.name = 'Supplier name is required';
    if (!formData.contactName.trim()) errors.contactName = 'Contact name is required';
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }
    
    if (!formData.phone.trim()) errors.phone = 'Phone number is required';
    if (!formData.category.trim()) errors.category = 'Category is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    onSave(formData);
  };
  
  // Category options
  const categoryOptions = [
    'Apparel',
    'Electronics',
    'Homeware',
    'Fitness',
    'Supplements',
    'Office Supplies',
    'Furniture',
    'Food & Beverage',
    'Beauty & Personal Care',
    'Other'
  ];

  // Payment terms options
  const paymentTermsOptions = [
    'Net 15',
    'Net 30',
    'Net 45',
    'Net 60',
    'Due on Receipt',
    'COD (Cash on Delivery)',
    'Advance Payment'
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onCancel}
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-white dark:bg-surface-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center px-6 py-4 border-b border-surface-200 dark:border-surface-700">
          <h3 className="text-xl font-bold">
            {mode === 'add' ? 'Add New Supplier' : 'Edit Supplier'}
          </h3>
          <button 
            onClick={onCancel}
            className="p-1 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
            aria-label="Close"
          >
            <XIcon size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="form-label">Supplier Name <span className="text-red-500">*</span></label>
              <input 
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`form-input ${formErrors.name ? 'border-red-500 dark:border-red-500' : ''}`}
              />
              {formErrors.name && <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>}
            </div>
            
            <div>
              <label htmlFor="category" className="form-label">Category <span className="text-red-500">*</span></label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={`form-input ${formErrors.category ? 'border-red-500 dark:border-red-500' : ''}`}
              >
                <option value="">Select Category</option>
                {categoryOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              {formErrors.category && <p className="mt-1 text-sm text-red-500">{formErrors.category}</p>}
            </div>
            
            <div>
              <label htmlFor="contactName" className="form-label">Contact Person <span className="text-red-500">*</span></label>
              <input 
                type="text"
                id="contactName"
                name="contactName"
                value={formData.contactName}
                onChange={handleInputChange}
                className={`form-input ${formErrors.contactName ? 'border-red-500 dark:border-red-500' : ''}`}
              />
              {formErrors.contactName && <p className="mt-1 text-sm text-red-500">{formErrors.contactName}</p>}
            </div>
            
            <div>
              <label htmlFor="email" className="form-label">Email <span className="text-red-500">*</span></label>
              <input 
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`form-input ${formErrors.email ? 'border-red-500 dark:border-red-500' : ''}`}
              />
              {formErrors.email && <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>}
            </div>
            
            <div>
              <label htmlFor="phone" className="form-label">Phone <span className="text-red-500">*</span></label>
              <input 
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`form-input ${formErrors.phone ? 'border-red-500 dark:border-red-500' : ''}`}
              />
              {formErrors.phone && <p className="mt-1 text-sm text-red-500">{formErrors.phone}</p>}
            </div>
            
            <div>
              <label htmlFor="status" className="form-label">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="form-input"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          
          <div>
            <label htmlFor="address" className="form-label">Address</label>
            <input 
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="website" className="form-label">Website</label>
              <input 
                type="text"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                className="form-input"
                placeholder="www.example.com"
              />
            </div>
            
            <div>
              <label htmlFor="paymentTerms" className="form-label">Payment Terms</label>
              <select
                id="paymentTerms"
                name="paymentTerms"
                value={formData.paymentTerms}
                onChange={handleInputChange}
                className="form-input"
              >
                <option value="">Select Payment Terms</option>
                {paymentTermsOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div>
            <label htmlFor="notes" className="form-label">Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              className="form-input min-h-[80px]"
              placeholder="Additional information about this supplier..."
            ></textarea>
          </div>
          
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary flex items-center"
            >
              {mode === 'add' ? (
                <><SaveIcon size={18} className="mr-2" />Save Supplier</>
              ) : (
                <><CheckIcon size={18} className="mr-2" />Update Supplier</>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default SupplierForm;