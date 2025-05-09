import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';
import OrderForm from '../components/OrderForm';
import OrderDetails from '../components/OrderDetails';

function Orders() {
  // Icons
  const PlusIcon = getIcon('Plus');
  const SearchIcon = getIcon('Search');
  const FilterIcon = getIcon('Filter');
  const ArrowUpDownIcon = getIcon('ArrowUpDown');
  const EyeIcon = getIcon('Eye');
  const EditIcon = getIcon('Edit');
  const Trash2Icon = getIcon('Trash2');
  const TruckIcon = getIcon('Truck');

  // State for orders
  const [orders, setOrders] = useState([
    { 
      id: 1, 
      orderNumber: 'ORD-2023-001', 
      customerName: 'John Doe', 
      orderDate: '2023-05-12', 
      status: 'Delivered', 
      total: 129.97,
      items: [
        { id: 1, productId: 1, name: 'T-Shirt (Black)', quantity: 2, price: 19.99 },
        { id: 3, productId: 3, name: 'Wireless Earbuds', quantity: 1, price: 89.99 }
      ],
      shippingAddress: '123 Main St, Anytown, AT 12345',
      paymentMethod: 'Credit Card',
      notes: 'Leave package at the door'
    },
    { 
      id: 2, 
      orderNumber: 'ORD-2023-002', 
      customerName: 'Jane Smith', 
      orderDate: '2023-05-15', 
      status: 'Processing', 
      total: 142.95,
      items: [
        { id: 2, productId: 2, name: 'Coffee Mug', quantity: 3, price: 12.50 },
        { id: 4, productId: 4, name: 'Yoga Mat', quantity: 1, price: 29.95 },
        { id: 5, productId: 5, name: 'Protein Powder', quantity: 1, price: 54.99 }
      ],
      shippingAddress: '456 Oak Ave, Springfield, SP 67890',
      paymentMethod: 'PayPal',
      notes: ''
    },
    { 
      id: 3, 
      orderNumber: 'ORD-2023-003', 
      customerName: 'Robert Johnson', 
      orderDate: '2023-05-18', 
      status: 'Shipped', 
      total: 209.97,
      items: [
        { id: 3, productId: 3, name: 'Wireless Earbuds', quantity: 2, price: 89.99 },
        { id: 5, productId: 5, name: 'Protein Powder', quantity: 1, price: 54.99 }
      ],
      shippingAddress: '789 Pine Blvd, Lakeside, LS 34567',
      paymentMethod: 'Credit Card',
      notes: 'Call before delivery'
    },
    { 
      id: 4, 
      orderNumber: 'ORD-2023-004', 
      customerName: 'Emily Davis', 
      orderDate: '2023-05-20', 
      status: 'Pending', 
      total: 39.98,
      items: [
        { id: 1, productId: 1, name: 'T-Shirt (Black)', quantity: 2, price: 19.99 }
      ],
      shippingAddress: '321 Cedar St, Rivertown, RT 45678',
      paymentMethod: 'PayPal',
      notes: ''
    }
  ]);

  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortField, setSortField] = useState('orderDate');
  const [sortDirection, setSortDirection] = useState('desc');

  // State for forms and details
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState('add');
  const [currentOrder, setCurrentOrder] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Available statuses
  const orderStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  // Function to filter and sort orders
  const getFilteredOrders = () => {
    let filtered = [...orders];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(order => order.status === statusFilter);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let valueA = a[sortField];
      let valueB = b[sortField];
      
      // Handle date sorting
      if (sortField === 'orderDate') {
        valueA = new Date(valueA);
        valueB = new Date(valueB);
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

  const filteredOrders = getFilteredOrders();

  // Form handlers
  const openAddForm = () => {
    setCurrentOrder(null);
    setFormMode('add');
    setIsFormOpen(true);
  };

  const openEditForm = (order) => {
    setCurrentOrder(order);
    setFormMode('edit');
    setIsFormOpen(true);
  };

  const handleCreateOrder = (newOrder) => {
    // Generate a new ID and order number
    const newId = Math.max(...orders.map(order => order.id), 0) + 1;
    const orderNumber = `ORD-${new Date().getFullYear()}-${String(newId).padStart(3, '0')}`;
    
    const orderToAdd = { 
      ...newOrder,
      id: newId,
      orderNumber,
      orderDate: new Date().toISOString().split('T')[0]
    };
    
    setOrders([...orders, orderToAdd]);
    setIsFormOpen(false);
    toast.success('Order created successfully');
  };

  const handleUpdateOrder = (updatedOrder) => {
    setOrders(orders.map(order => 
      order.id === updatedOrder.id ? updatedOrder : order
    ));
    setIsFormOpen(false);
    toast.success('Order updated successfully');
  };

  const handleDeleteOrder = (id) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      setOrders(orders.filter(order => order.id !== id));
      toast.success('Order deleted successfully');
    }
  };

  // View order details
  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Orders Management</h2>
        <button 
          onClick={openAddForm}
          className="btn btn-primary flex items-center"
        >
          <PlusIcon size={18} className="mr-2" />
          New Order
        </button>
      </div>
      
      {/* Filters and Search */}
      <div className="card neu-shadow space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-10"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400">
                <SearchIcon size={18} />
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-auto flex items-center gap-2">
            <div className="text-surface-500 dark:text-surface-400">
              <FilterIcon size={18} />
            </div>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-input"
            >
              <option value="">All Statuses</option>
              {orderStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Orders Table */}
      <div className="card neu-shadow overflow-x-auto">
        {filteredOrders.length > 0 ? (
          <table className="min-w-full">
            <thead className="bg-surface-100 dark:bg-surface-700">
              <tr>
                <th 
                  className="px-4 py-3 text-left text-sm font-medium text-surface-600 dark:text-surface-300 cursor-pointer"
                  onClick={() => handleSort('orderNumber')}
                >
                  <div className="flex items-center">
                    Order #
                    {sortField === 'orderNumber' && (
                      <span className="ml-1">
                        <ArrowUpDownIcon size={14} />
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-sm font-medium text-surface-600 dark:text-surface-300 cursor-pointer"
                  onClick={() => handleSort('customerName')}
                >
                  <div className="flex items-center">
                    Customer
                    {sortField === 'customerName' && (
                      <span className="ml-1">
                        <ArrowUpDownIcon size={14} />
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-sm font-medium text-surface-600 dark:text-surface-300 cursor-pointer hidden md:table-cell"
                  onClick={() => handleSort('orderDate')}
                >
                  <div className="flex items-center">
                    Date
                    {sortField === 'orderDate' && (
                      <span className="ml-1">
                        <ArrowUpDownIcon size={14} />
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-sm font-medium text-surface-600 dark:text-surface-300 cursor-pointer"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center">
                    Status
                    {sortField === 'status' && (
                      <span className="ml-1">
                        <ArrowUpDownIcon size={14} />
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-right text-sm font-medium text-surface-600 dark:text-surface-300 cursor-pointer"
                  onClick={() => handleSort('total')}
                >
                  <div className="flex items-center justify-end">
                    Total
                    {sortField === 'total' && (
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
              {filteredOrders.map(order => (
                <tr key={order.id} className="hover:bg-surface-50 dark:hover:bg-surface-800/50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                    {order.orderNumber}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    {order.customerName}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-surface-600 dark:text-surface-400 hidden md:table-cell">
                    {new Date(order.orderDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      order.status === 'Delivered' 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' 
                        : order.status === 'Shipped' 
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400'
                          : order.status === 'Processing'
                            ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400'
                            : order.status === 'Cancelled'
                              ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
                              : 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                    ${order.total.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                    <div className="flex justify-end space-x-2">
                      <button 
                        onClick={() => openOrderDetails(order)}
                        className="p-1 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        aria-label="View details"
                      >
                        <EyeIcon size={18} />
                      </button>
                      <button 
                        onClick={() => openEditForm(order)}
                        className="p-1 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        aria-label="Edit"
                      >
                        <EditIcon size={18} />
                      </button>
                      <button 
                        onClick={() => handleDeleteOrder(order.id)}
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
              <TruckIcon size={24} className="text-surface-500" />
            </div>
            <h3 className="text-lg font-medium mb-1">No Orders Found</h3>
            <p className="text-surface-500 dark:text-surface-400 max-w-md mx-auto">
              {searchTerm || statusFilter
                ? "No orders match your current filters. Try adjusting your search criteria."
                : "You haven't created any orders yet. Click 'New Order' to get started."}
            </p>
          </div>
        )}
      </div>
      
      {/* Order Form */}
      <AnimatePresence>
        {isFormOpen && (
          <OrderForm
            isOpen={isFormOpen}
            onClose={() => setIsFormOpen(false)}
            mode={formMode}
            order={currentOrder}
            onCreateOrder={handleCreateOrder}
            onUpdateOrder={handleUpdateOrder}
            availableStatuses={orderStatuses}
          />
        )}
      </AnimatePresence>
      
      {/* Order Details */}
      <AnimatePresence>
        {isDetailsOpen && selectedOrder && (
          <OrderDetails
            isOpen={isDetailsOpen}
            onClose={() => setIsDetailsOpen(false)}
            order={selectedOrder}
            onEdit={() => {
              setIsDetailsOpen(false);
              openEditForm(selectedOrder);
            }}
            onStatusChange={(newStatus) => {
              const updatedOrder = { ...selectedOrder, status: newStatus };
              handleUpdateOrder(updatedOrder);
              setSelectedOrder(updatedOrder);
            }}
            availableStatuses={orderStatuses}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default Orders;