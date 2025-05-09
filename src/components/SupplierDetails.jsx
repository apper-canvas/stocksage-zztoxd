import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';

function SupplierDetails({ supplier, onClose, onEdit }) {
  // Icons
  const XIcon = getIcon('X');
  const EditIcon = getIcon('Edit');
  const MailIcon = getIcon('Mail');
  const PhoneIcon = getIcon('Phone');
  const GlobeIcon = getIcon('Globe');
  const MapPinIcon = getIcon('MapPin');
  const ClipboardIcon = getIcon('Clipboard');
  const TagIcon = getIcon('Tag');
  const CalendarIcon = getIcon('Calendar');
  const PackageIcon = getIcon('Package');
  
  // Status color based on supplier status
  const statusColor = supplier.status === 'active'
    ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
    : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400';

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
        className="bg-white dark:bg-surface-800 rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center px-6 py-4 border-b border-surface-200 dark:border-surface-700">
          <h3 className="text-xl font-bold">Supplier Details</h3>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
            aria-label="Close"
          >
            <XIcon size={20} />
          </button>
        </div>
        
        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">{supplier.name}</h2>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor}`}>
                  {supplier.status === 'active' ? 'Active' : 'Inactive'}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400">
                  {supplier.category}
                </span>
              </div>
            </div>
            <button
              onClick={onEdit}
              className="btn btn-outline mt-4 md:mt-0 flex items-center self-start"
            >
              <EditIcon size={18} className="mr-2" />
              Edit Supplier
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold border-b border-surface-200 dark:border-surface-700 pb-2">Contact Information</h4>
              
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="text-primary mt-0.5 mr-3">
                    <MailIcon size={18} />
                  </div>
                  <div>
                    <p className="text-sm text-surface-500 dark:text-surface-400">Email</p>
                    <p>{supplier.email}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="text-primary mt-0.5 mr-3">
                    <PhoneIcon size={18} />
                  </div>
                  <div>
                    <p className="text-sm text-surface-500 dark:text-surface-400">Phone</p>
                    <p>{supplier.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="text-primary mt-0.5 mr-3">
                    <MapPinIcon size={18} />
                  </div>
                  <div>
                    <p className="text-sm text-surface-500 dark:text-surface-400">Address</p>
                    <p>{supplier.address || 'Not specified'}</p>
                  </div>
                </div>
                
                {supplier.website && (
                  <div className="flex items-start">
                    <div className="text-primary mt-0.5 mr-3">
                      <GlobeIcon size={18} />
                    </div>
                    <div>
                      <p className="text-sm text-surface-500 dark:text-surface-400">Website</p>
                      <p>{supplier.website}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-start">
                  <div className="text-primary mt-0.5 mr-3">
                    <ClipboardIcon size={18} />
                  </div>
                  <div>
                    <p className="text-sm text-surface-500 dark:text-surface-400">Contact Person</p>
                    <p>{supplier.contactName}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-lg font-semibold border-b border-surface-200 dark:border-surface-700 pb-2">Supplier Details</h4>
              
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="text-primary mt-0.5 mr-3">
                    <CalendarIcon size={18} />
                  </div>
                  <div>
                    <p className="text-sm text-surface-500 dark:text-surface-400">Payment Terms</p>
                    <p>{supplier.paymentTerms || 'Not specified'}</p>
                  </div>
                </div>
                
                {supplier.notes && (
                  <div className="flex items-start">
                    <div className="text-primary mt-0.5 mr-3">
                      <TagIcon size={18} />
                    </div>
                    <div>
                      <p className="text-sm text-surface-500 dark:text-surface-400">Notes</p>
                      <p className="whitespace-pre-line">{supplier.notes}</p>
                    </div>
                  </div>
                )}
                
                {supplier.products && supplier.products.length > 0 && (
                  <div className="flex items-start">
                    <div className="text-primary mt-0.5 mr-3">
                      <PackageIcon size={18} />
                    </div>
                    <div>
                      <p className="text-sm text-surface-500 dark:text-surface-400">Products</p>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {supplier.products.map((product, index) => (
                          <span 
                            key={index} 
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface-100 dark:bg-surface-700"
                          >
                            {product}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default SupplierDetails;