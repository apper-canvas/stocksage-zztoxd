import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';
import { toast } from 'react-toastify';

function OrderDetails({ isOpen, onClose, order, onEdit, onStatusChange, availableStatuses }) {
  // Icons
  const XIcon = getIcon('X');
  const EditIcon = getIcon('Edit');
  const PackageIcon = getIcon('Package');
  const TruckIcon = getIcon('Truck');
  const MapPinIcon = getIcon('MapPin');
  const CreditCardIcon = getIcon('CreditCard');
  const CalendarIcon = getIcon('Calendar');
  const UserIcon = getIcon('User');
  const CheckCircleIcon = getIcon('CheckCircle');

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Handle status change
  const handleStatusChange = (newStatus) => {
    if (newStatus !== order.status) {
      onStatusChange(newStatus);
      toast.success(`Order status updated to ${newStatus}`);
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered':
        return getIcon('CheckCircle');
      case 'Shipped':
        return getIcon('Truck');
      case 'Processing':
        return getIcon('Package');
      case 'Cancelled':
        return getIcon('X');
      default:
        return getIcon('Clock');
    }
  };

  // Get status color class
  const getStatusClass = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400';
      case 'Shipped':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400';
      case 'Processing':
        return 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400';
      case 'Cancelled':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400';
      default:
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400';
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
          <h3 className="text-xl font-bold flex items-center">
            <span>Order Details: {order.orderNumber}</span>
          </h3>
          <div className="flex items-center gap-2">
            <button 
              onClick={onEdit}
              className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 text-blue-500"
              aria-label="Edit order"
            >
              <EditIcon size={18} />
            </button>
            <button 
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700"
              aria-label="Close"
            >
              <XIcon size={18} />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Order Summary */}
            <div className="md:col-span-2 space-y-6">
              <div>
                <h4 className="text-lg font-semibold mb-3 border-b border-surface-200 dark:border-surface-700 pb-2">Order Summary</h4>
                
                <div className="space-y-4">
                  <div className="flex gap-4 items-center">
                    <div className="bg-surface-100 dark:bg-surface-700 p-3 rounded-md text-surface-600 dark:text-surface-300">
                      <CalendarIcon size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-surface-500 dark:text-surface-400">Order Date</p>
                      <p className="font-medium">{formatDate(order.orderDate)}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 items-center">
                    <div className="bg-surface-100 dark:bg-surface-700 p-3 rounded-md text-surface-600 dark:text-surface-300">
                      <UserIcon size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-surface-500 dark:text-surface-400">Customer</p>
                      <p className="font-medium">{order.customerName}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 items-center">
                    <div className="bg-surface-100 dark:bg-surface-700 p-3 rounded-md text-surface-600 dark:text-surface-300">
                      <MapPinIcon size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-surface-500 dark:text-surface-400">Shipping Address</p>
                      <p className="font-medium">{order.shippingAddress}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 items-center">
                    <div className="bg-surface-100 dark:bg-surface-700 p-3 rounded-md text-surface-600 dark:text-surface-300">
                      <CreditCardIcon size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-surface-500 dark:text-surface-400">Payment Method</p>
                      <p className="font-medium">{order.paymentMethod}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-3 border-b border-surface-200 dark:border-surface-700 pb-2">Order Items</h4>
                
                <div className="rounded-lg border border-surface-200 dark:border-surface-700 overflow-hidden">
                  <table className="min-w-full divide-y divide-surface-200 dark:divide-surface-700">
                    <thead className="bg-surface-50 dark:bg-surface-800">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Product</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Quantity</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Price</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-surface-800 divide-y divide-surface-200 dark:divide-surface-700">
                      {order.items.map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-8 w-8 flex-shrink-0 rounded bg-surface-100 dark:bg-surface-700 flex items-center justify-center">
                                <PackageIcon size={16} className="text-surface-500 dark:text-surface-400" />
                              </div>
                              <div className="ml-3">
                                <p className="text-sm font-medium">{item.name}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                            ${item.price.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-medium">
                            ${(item.quantity * item.price).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-surface-50 dark:bg-surface-800">
                      <tr>
                        <td colSpan="3" className="px-4 py-3 text-right font-bold">Total:</td>
                        <td className="px-4 py-3 text-right font-bold">${order.total.toFixed(2)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
              
              {order.notes && (
                <div className="bg-surface-50 dark:bg-surface-700/50 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Order Notes:</h4>
                  <p className="text-surface-600 dark:text-surface-300">{order.notes}</p>
                </div>
              )}
            </div>
            
            {/* Order Status */}
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold mb-3 border-b border-surface-200 dark:border-surface-700 pb-2">Order Status</h4>
                
                <div>
                  <div className={`rounded-lg p-4 mb-4 flex items-center gap-3 ${getStatusClass(order.status)}`}>
                    {React.createElement(getStatusIcon(order.status), { size: 20 })}
                    <span className="font-medium">{order.status}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="form-label">Update Status</label>
                    <div className="space-y-2">
                      {availableStatuses.map(status => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => handleStatusChange(status)}
                          className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-3 ${
                            status === order.status 
                              ? 'bg-primary/10 dark:bg-primary/20 text-primary font-medium'
                              : 'bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600'
                          }`}
                          disabled={status === order.status}
                        >
                          {React.createElement(getStatusIcon(status), { size: 16 })}
                          <span>{status}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-3 border-b border-surface-200 dark:border-surface-700 pb-2">Shipping</h4>
                <div className="rounded-lg border border-surface-200 dark:border-surface-700 p-4">
                  <div className="flex gap-3 items-start">
                    <div className="text-blue-500">
                      <TruckIcon size={20} />
                    </div>
                    <div>
                      <p className="font-medium mb-1">Standard Shipping</p>
                      <p className="text-sm text-surface-500 dark:text-surface-400">
                        {order.status === 'Delivered' 
                          ? 'Delivered on ' + formatDate(order.orderDate)
                          : order.status === 'Shipped' 
                            ? 'In transit, estimated delivery in 2-3 days'
                            : order.status === 'Processing'
                              ? 'Preparing for shipment'
                              : order.status === 'Cancelled'
                                ? 'Shipping cancelled'
                                : 'Not yet shipped'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={onEdit}
                className="w-full btn btn-outline mt-4 flex items-center justify-center"
              >
                <EditIcon size={18} className="mr-2" />
                Edit Order
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default OrderDetails;