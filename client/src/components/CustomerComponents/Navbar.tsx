import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingBag, ShoppingCart, Menu, X, User } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const user = useSelector((state: RootState) => state.auth.user);
  
  // Example cart count - replace with actual cart count from your state management
  const cartCount = 3;
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const handleSearch = (e:FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    // Implement your search functionality
  };
  
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <ShoppingBag className="h-8 w-8 text-emerald-500" />
              <span className="ml-2 text-xl font-bold text-gray-800">FreshMart</span>
            </Link>
          </div>
          
          {/* Desktop Navigation Items */}
          <div className="hidden md:flex items-center justify-center flex-1 space-x-8">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="w-full max-w-lg">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full py-2 pl-4 pr-10 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button type="submit" className="absolute right-0 top-0 h-full px-3 text-gray-500 hover:text-emerald-500">
                  <Search size={18} />
                </button>
              </div>
            </form>
          </div>
          
          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Shop Link */}
            <Link to="/shop" className="flex items-center text-gray-700 hover:text-emerald-500">
              <ShoppingBag size={20} className="mr-1" />
              <span>Shop</span>
            </Link>
            
            {/* Cart */}
            <Link to="/cart" className="flex items-center text-gray-700 hover:text-emerald-500 relative">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
              <span className="ml-1">Cart</span>
            </Link>
            
            {/* User Profile */}
            <Link to="/profile" className="flex items-center text-gray-700 hover:text-emerald-500">
              {user?.image ? (
                <img 
                  src={user?.image} 
                  alt={user?.name} 
                  className="h-8 w-8 rounded-full object-cover border-2 border-emerald-500"
                />
              ) : (
                <User size={20} className="text-gray-700" />
              )}
              <span className="ml-2">{user?.name}</span>
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-emerald-500 focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="mb-4">
            <div className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full py-2 pl-4 pr-10 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button type="submit" className="absolute right-0 top-0 h-full px-3 text-gray-500 hover:text-emerald-500">
                <Search size={18} />
              </button>
            </div>
          </form>
          
          {/* Mobile Links */}
          <Link 
            to="/shop" 
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-emerald-500"
            onClick={toggleMenu}
          >
            <div className="flex items-center">
              <ShoppingBag size={18} className="mr-2" />
              Shop
            </div>
          </Link>
          
          <Link 
            to="/cart" 
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-emerald-500"
            onClick={toggleMenu}
          >
            <div className="flex items-center">
              <ShoppingCart size={18} className="mr-2" />
              Cart
              {cartCount > 0 && (
                <span className="ml-2 bg-emerald-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
          </Link>
          
          <Link 
            to="/profile" 
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-emerald-500"
            onClick={toggleMenu}
          >
            <div className="flex items-center">
              {user?.image ? (
                <img 
                  src={user?.image} 
                  alt={user?.name} 
                  className="h-6 w-6 rounded-full object-cover border border-emerald-500 mr-2"
                />
              ) : (
                <User size={18} className="mr-2" />
              )}
              {user?.name}
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;