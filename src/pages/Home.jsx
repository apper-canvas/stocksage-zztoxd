import { useState } from 'react';
import MainFeature from '../components/MainFeature';
import getIcon from '../utils/iconUtils';

function Home() {
  const [activeTab, setActiveTab] = useState('inventory');
  
  // Define icons at the top of the component
  const LayoutDashboardIcon = getIcon('LayoutDashboard');
  const PackageIcon = getIcon('Package');
  const ShoppingCartIcon = getIcon('ShoppingCart');
  const TruckIcon = getIcon('Truck');
  const BarChartIcon = getIcon('BarChart');
  
  // Dashboard stats data
  const dashboardStats = [
    { id: 1, title: 'Total Products', value: '248', change: '+12%', icon: 'Package', color: 'bg-blue-500' },
    { id: 2, title: 'Low Stock Items', value: '24', change: '-5%', icon: 'AlertTriangle', color: 'bg-amber-500' },
    { id: 3, title: 'Pending Orders', value: '16', change: '+8%', icon: 'ShoppingCart', color: 'bg-indigo-500' },
    { id: 4, title: 'Total Value', value: '$45,289', change: '+15%', icon: 'DollarSign', color: 'bg-green-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 lg:w-72 flex-shrink-0">
          <div className="card neu-shadow">
            <nav className="space-y-1">
              <button 
                className={`flex items-center w-full px-3 py-3 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-primary/10 text-primary dark:bg-primary/20' : 'hover:bg-surface-100 dark:hover:bg-surface-700'}`}
                onClick={() => setActiveTab('dashboard')}
              >
                <span className="mr-3">
                  <LayoutDashboardIcon size={20} />
                </span>
                <span>Dashboard</span>
              </button>
              
              <button 
                className={`flex items-center w-full px-3 py-3 rounded-lg transition-colors ${activeTab === 'inventory' ? 'bg-primary/10 text-primary dark:bg-primary/20' : 'hover:bg-surface-100 dark:hover:bg-surface-700'}`}
                onClick={() => setActiveTab('inventory')}
              >
                <span className="mr-3">
                  <PackageIcon size={20} />
                </span>
                <span>Inventory</span>
              </button>
              
              <button 
                className={`flex items-center w-full px-3 py-3 rounded-lg transition-colors ${activeTab === 'orders' ? 'bg-primary/10 text-primary dark:bg-primary/20' : 'hover:bg-surface-100 dark:hover:bg-surface-700'}`}
                onClick={() => setActiveTab('orders')}
              >
                <span className="mr-3">
                  <ShoppingCartIcon size={20} />
                </span>
                <span>Orders</span>
              </button>
              
              <button 
                className={`flex items-center w-full px-3 py-3 rounded-lg transition-colors ${activeTab === 'suppliers' ? 'bg-primary/10 text-primary dark:bg-primary/20' : 'hover:bg-surface-100 dark:hover:bg-surface-700'}`}
                onClick={() => setActiveTab('suppliers')}
              >
                <span className="mr-3">
                  <TruckIcon size={20} />
                </span>
                <span>Suppliers</span>
              </button>
              
              <button 
                className={`flex items-center w-full px-3 py-3 rounded-lg transition-colors ${activeTab === 'reports' ? 'bg-primary/10 text-primary dark:bg-primary/20' : 'hover:bg-surface-100 dark:hover:bg-surface-700'}`}
                onClick={() => setActiveTab('reports')}
              >
                <span className="mr-3">
                  <BarChartIcon size={20} />
                </span>
                <span>Reports</span>
              </button>
            </nav>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Dashboard</h2>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {dashboardStats.map((stat) => {
                  const StatIcon = getIcon(stat.icon);
                  return (
                    <div key={stat.id} className="card neu-shadow hover:shadow-lg transition-shadow">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-sm text-surface-500 dark:text-surface-400">{stat.title}</p>
                          <p className="text-2xl font-bold mt-1">{stat.value}</p>
                          <span className={`text-xs px-2 py-1 rounded-full ${stat.change.startsWith('+') ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'} mt-2 inline-block`}>
                            {stat.change}
                          </span>
                        </div>
                        <div className={`${stat.color} h-12 w-12 rounded-lg flex items-center justify-center text-white`}>
                          <StatIcon size={20} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Dashboard Charts Placeholder */}
              <div className="card neu-shadow">
                <h3 className="text-lg font-semibold mb-4">Inventory Overview</h3>
                <div className="h-64 bg-surface-100 dark:bg-surface-700 rounded-lg flex items-center justify-center">
                  <p className="text-surface-500">Chart visualization coming soon</p>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'inventory' && (
            <MainFeature />
          )}
          
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Orders</h2>
              <div className="card neu-shadow">
                <p className="text-surface-500">Orders management coming soon</p>
              </div>
            </div>
          )}
          
          {activeTab === 'suppliers' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Suppliers</h2>
              <div className="card neu-shadow">
                <p className="text-surface-500">Supplier management coming soon</p>
              </div>
            </div>
          )}
          
          {activeTab === 'reports' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Reports</h2>
              <div className="card neu-shadow">
                <p className="text-surface-500">Reporting tools coming soon</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;