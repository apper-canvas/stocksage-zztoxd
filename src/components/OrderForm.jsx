import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';

function OrderForm({ isOpen, onClose, mode, order, onCreateOrder, onUpdateOrder, availableStatuses }) {
  // Icons
  const XIcon = getIcon('X');
  const PlusIcon = getIcon('Plus');
  const MinusIcon = getIcon('Minus');
  const PackageIcon = getIcon('Package');
  const SaveIcon = getIcon('Save');
  const CheckIcon = getIcon('Check');

  // Sample inventory for product selection
  const [inventory, setInventory] = useState([
    { id: 1, name: 'T-Shirt (Black)', sku: 'TS-BLK-001', price: 19.99, currentStock: 45 },
    { id: 2, name: 'Coffee Mug', sku: 'HW-MUG-224', price: 12.50, currentStock: 8 },
    { id: 3, name: 'Wireless Earbuds', sku: 'TECH-EB-774', price: 89.99, currentStock: 23 },
    { id: 4, name: 'Yoga Mat', sku: 'FIT-YM-412', price: 29.95, currentStock: 12 },
    { id: 5, name: 'Protein Powder', sku: 'SUPP-PP-118', price: 54.99, currentStock: 17 },
  ]);

  // Order form state
  const [formData, setFormData] = useState({
    customerName: '',
    shippingAddress: '',
    paymentMethod: 'Credit Card',
    status: 'Pending',
    notes: '',
    items: []
  });

  const [formErrors, setFormErrors] = useState({});
  
  // Initialize form if editing existing order
  useEffect(() => {
    if (mode === 'edit' && order) {
      setFormData({
        id: order.id,
        orderNumber: order.orderNumber,
        orderDate: order.orderDate,
        customerName: order.customerName,
        shippingAddress: order.shippingAddress,
        paymentMethod: order.paymentMethod,
        status: order.status,
        notes: order.notes,
        items: order.items.map(item => ({
          ...item,
          subtotal: item.quantity * item.price
        }))
      });
    }
  }, [mode, order]);

  // Calculate order total
  const calculateTotal = () => {
    return formData.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };

  // Form input handlers
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

  // Add product to order
  const handleAddProduct = () => {
    if (formData.items.length < inventory.length) {
      // Find a product that's not already in the order
      const availableProducts = inventory.filter(
        product => !formData.items.some(item => item.productId === product.id)
      );
      
      if (availableProducts.length > 0) {
        const productToAdd = availableProducts[0];
        const newItem = {
          id: Date.now(), // Temporary ID for the form
          productId: productToAdd.id,
          name: productToAdd.name,
          price: productToAdd.price,
          quantity: 1,
          subtotal: productToAdd.price
        };
        
        setFormData({
          ...formData,
          items: [...formData.items, newItem]
        });
      }
    } else {
      toast.info("All available products have been added to the order");
    }
  };

  // Remove product from order
  const handleRemoveProduct = (itemId) => {
    setFormData({
      ...formData,
      items: formData.items.filter(item => item.id !== itemId)
    });
  };

  // Update product quantity
  const handleQuantityChange = (itemId, newQuantity) => {
    // Find the product in inventory to check stock
    const item = formData.items.find(item => item.id === itemId);
    const product = inventory.find(product => product.id === item.productId);
    
    // Validate quantity
    if (newQuantity < 1) {
      newQuantity = 1;
      toast.warning("Quantity cannot be less than 1");
    } else if (newQuantity > product.currentStock) {
      newQuantity = product.currentStock;
      toast.warning(`Only ${product.currentStock} units available in stock`);
    }
    
    // Update the item
    setFormData({
      ...formData,
      items: formData.items.map(item => {
        if (item.id === itemId) {
          return {
            ...item,
            quantity: newQuantity,
            subtotal: newQuantity * item.price
          };
        }
        return item;
      })
    });
  };

  // Change product in order
  const handleProductChange = (itemId, productId) => {
    const selectedProduct = inventory.find(product => product.id === Number(productId));
    if (selectedProduct) {
      setFormData({
        ...formData,
        items: formData.items.map(item => {
          if (item.id === itemId) {
            return {
              ...item,
              productId: selectedProduct.id,
              name: selectedProduct.name,
              price: selectedProduct.price,
              quantity: 1,
              subtotal: selectedProduct.price
            };
          }
          return item;
        })
      });
    }
  };

  // Form validation
  const validateForm = () => {
    const errors = {};
    if (!formData.customerName.trim()) errors.customerName = 'Customer name is required';
    if (!formData.shippingAddress.trim()) errors.shippingAddress = 'Shipping address is required';
    if (!formData.paymentMethod) errors.paymentMethod = 'Payment method is required';
    if (formData.items.length === 0) errors.items = 'Order must contain at least one item';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the form errors');
      return;
    }
    
    const orderData = {
      ...formData,
      total: calculateTotal()
    };
    
    if (mode === 'add') {
      onCreateOrder(orderData);
    } else {
      onUpdateOrder(orderData);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-white dark:bg-surface-800 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center px-6 py-4 border-b border-surface-200 dark:border-surface-700">
          <h3 className="text-xl font-bold">
            {mode === 'add' ? 'Create New Order' : 'Edit Order'}
          </h3>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
            aria-label="Close"
          >
            <XIcon size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold border-b border-surface-200 dark:border-surface-700 pb-2">Customer Information</h4>
              
              <div>
                <label htmlFor="customerName" className="form-label">Customer Name</label>
                <input 
                  type="text"
                  id="customerName"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  className={`form-input ${formErrors.customerName ? 'border-red-500 dark:border-red-500' : ''}`}
                />
                {formErrors.customerName && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.customerName}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="shippingAddress" className="form-label">Shipping Address</label>
                <textarea 
                  id="shippingAddress"
                  name="shippingAddress"
                  value={formData.shippingAddress}
                  onChange={handleInputChange}
                  rows="3"
                  className={`form-input ${formErrors.shippingAddress ? 'border-red-500 dark:border-red-500' : ''}`}
                />
                {formErrors.shippingAddress && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.shippingAddress}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="paymentMethod" className="form-label">Payment Method</label>
                <select 
                  id="paymentMethod"
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                  className={`form-input ${formErrors.paymentMethod ? 'border-red-500 dark:border-red-500' : ''}`}
                >
                  <option value="Credit Card">Credit Card</option>
                  <option value="PayPal">PayPal</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Cash on Delivery">Cash on Delivery</option>
                </select>
                {formErrors.paymentMethod && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.paymentMethod}</p>
                )}
              </div>
              
              {mode === 'edit' && (
                <div>
                  <label htmlFor="status" className="form-label">Order Status</label>
                  <select 
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="form-input"
                  >
                    {availableStatuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              )}
              
              <div>
                <label htmlFor="notes" className="form-label">Order Notes</label>
                <textarea 
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows="3"
                  className="form-input"
                  placeholder="Special instructions or notes for this order"
                />
              </div>
            </div>
            
            {/* Order Items */}
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-surface-200 dark:border-surface-700 pb-2">
                <h4 className="text-lg font-semibold">Order Items</h4>
                <button
                  type="button"
                  onClick={handleAddProduct}
                  className="btn btn-outline text-sm py-1 px-3 flex items-center"
                >
                  <PlusIcon size={16} className="mr-1" />
                  Add Product
                </button>
              </div>
              
              {formErrors.items && (
                <p className="mt-1 text-sm text-red-500">{formErrors.items}</p>
              )}
              
              {formData.items.length > 0 ? (
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  {formData.items.map(item => (
                    <div key={item.id} className="bg-surface-50 dark:bg-surface-700/50 rounded-lg p-3 space-y-3">
                      <div className="flex justify-between">
                        <label className="form-label" htmlFor={`product-${item.id}`}>Product</label>
                        <button
                          type="button"
                          onClick={() => handleRemoveProduct(item.id)}
                          className="text-red-500 hover:text-red-700 dark:text-red-400"
                        >
                          <XIcon size={16} />
                        </button>
                      </div>
                      
                      <select
                        id={`product-${item.id}`}
                        value={item.productId}
                        onChange={(e) => handleProductChange(item.id, e.target.value)}
                        className="form-input"
                      >
                        {inventory.map(product => (
                          <option 
                            key={product.id} 
                            value={product.id}
                            disabled={formData.items.some(i => i.productId === product.id && i.id !== item.id)}
                          >
                            {product.name} - ${product.price.toFixed(2)} - Stock: {product.currentStock}
                          </option>
                        ))}
                      </select>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="form-label" htmlFor={`quantity-${item.id}`}>Quantity</label>
                          <div className="flex">
                            <button
                              type="button"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              className="bg-surface-100 dark:bg-surface-600 px-3 rounded-l-lg border border-surface-300 dark:border-surface-500"
                            >
                              <MinusIcon size={16} />
                            </button>
                            <input
                              id={`quantity-${item.id}`}
                              type="number"
                              value={item.quantity}
                              onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                              className="form-input rounded-none border-x-0 text-center"
                              min="1"
                            />
                            <button
                              type="button"
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              className="bg-surface-100 dark:bg-surface-600 px-3 rounded-r-lg border border-surface-300 dark:border-surface-500"
                            >
                              <PlusIcon size={16} />
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="form-label">Subtotal</label>
                          <div className="form-input bg-surface-100 dark:bg-surface-700 cursor-not-allowed">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center border-2 border-dashed border-surface-200 dark:border-surface-700 rounded-lg">
                  <PackageIcon size={32} className="text-surface-400 mb-2" />
                  <p className="text-surface-500 mb-4">No products added to this order yet</p>
                  <button
                    type="button"
                    onClick={handleAddProduct}
                    className="btn btn-outline text-sm"
                  >
                    <PlusIcon size={16} className="mr-1" />
                    Add First Product
                  </button>
                </div>
              )}
              
              {formData.items.length > 0 && (
                <div className="border-t border-surface-200 dark:border-surface-700 pt-4 mt-4">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Order Total:</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-surface-200 dark:border-surface-700">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary flex items-center"
            >
              {mode === 'add' ? (
                <>
                  <SaveIcon size={18} className="mr-2" />
                  Create Order
                </>
              ) : (
                <>
                  <CheckIcon size={18} className="mr-2" />
                  Update Order
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default OrderForm;