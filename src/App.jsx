import React, { useState } from 'react';
import { ShoppingCart, Package, AlertCircle, CheckCircle, Plus, Minus, CreditCard } from 'lucide-react';
import './index.css'; // استدعاء ملف الـ CSS

const initialInventory = [
  { id: 1, name: 'Laptop Pro 15"', price: 1200, stock: 10 },
  { id: 2, name: 'Wireless Mouse', price: 25, stock: 50 },
  { id: 3, name: 'Mechanical Keyboard', price: 80, stock: 15 },
  { id: 4, name: 'USB-C Hub', price: 40, stock: 5 },
  { id: 5, name: 'HD Monitor 27"', price: 300, stock: 8 },
];

export default function App() {
  const [activeSystem, setActiveSystem] = useState('sales');
  const [inventory, setInventory] = useState(initialInventory);
  const [cart, setCart] = useState([]);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      if (existingItem.quantity + 1 > product.stock) {
        showNotification(`Cannot add more. Only ${product.stock} items left in stock!`, 'error');
        return;
      }
      setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      if (product.stock < 1) {
        showNotification('Item is out of stock!', 'error');
        return;
      }
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateCartQuantity = (productId, delta) => {
    const item = cart.find(i => i.id === productId);
    const productInStock = inventory.find(i => i.id === productId);
    if (item.quantity + delta > productInStock.stock) {
      showNotification(`Insufficient stock. Maximum available: ${productInStock.stock}`, 'error');
      return;
    }
    if (item.quantity + delta <= 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(i => i.id === productId ? { ...i, quantity: i.quantity + delta } : i));
    }
  };

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  const processCheckout = () => {
    if (cart.length === 0) {
      showNotification('Cart is empty!', 'error');
      return;
    }
    for (let item of cart) {
      const dbItem = inventory.find(i => i.id === item.id);
      if (dbItem.stock < item.quantity) {
        showNotification(`Checkout failed: ${item.name} does not have enough stock.`, 'error');
        return;
      }
    }
    const updatedInventory = inventory.map(dbItem => {
      const cartItem = cart.find(c => c.id === dbItem.id);
      if (cartItem) return { ...dbItem, stock: dbItem.stock - cartItem.quantity };
      return dbItem;
    });
    setInventory(updatedInventory);
    setCart([]);
    showNotification('Order processed successfully! Inventory has been updated automatically.', 'success');
  };

  const restockItem = (id, amount) => {
    setInventory(inventory.map(item => item.id === id ? { ...item, stock: item.stock + amount } : item));
    showNotification('Stock updated successfully.', 'success');
  };

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="nav-content">
          <h1><span className="badge">ERP</span> Core System</h1>
          <div className="nav-buttons">
            <button className={activeSystem === 'sales' ? 'active' : ''} onClick={() => setActiveSystem('sales')}>
              <ShoppingCart size={18} /> Sales (POS)
            </button>
            <button className={activeSystem === 'inventory' ? 'active' : ''} onClick={() => setActiveSystem('inventory')}>
              <Package size={18} /> Inventory
            </button>
          </div>
        </div>
      </nav>

      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <p>{notification.message}</p>
        </div>
      )}

      <main className="main-content">
        {activeSystem === 'sales' && (
          <div className="sales-system">
            <div className="products-section">
              <h2><ShoppingCart className="icon-blue" /> Point of Sale</h2>
              <div className="product-grid">
                {inventory.map(product => (
                  <div key={product.id} className="product-card">
                    <div>
                      <h3>{product.name}</h3>
                      <p className="price">${product.price.toFixed(2)}</p>
                      <p className={`stock ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
                      </p>
                    </div>
                    <button disabled={product.stock === 0} onClick={() => addToCart(product)} className="add-btn">
                      <Plus size={16} /> Add to Order
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="cart-sidebar">
              <h3>Current Order</h3>
              {cart.length === 0 ? (
                <p className="empty-cart">Cart is empty</p>
              ) : (
                <div className="cart-items">
                  {cart.map(item => (
                    <div key={item.id} className="cart-item">
                      <div className="cart-item-info">
                        <p>{item.name}</p>
                        <span>${item.price} x {item.quantity}</span>
                      </div>
                      <div className="cart-controls">
                        <button className="minus" onClick={() => updateCartQuantity(item.id, -1)}><Minus size={14}/></button>
                        <span>{item.quantity}</span>
                        <button className="plus" onClick={() => updateCartQuantity(item.id, 1)}><Plus size={14}/></button>
                      </div>
                    </div>
                  ))}
                  <div className="cart-total">
                    <div className="total-row">
                      <span>Total:</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    <button onClick={processCheckout} className="checkout-btn">
                      <CreditCard size={20} /> Process Order
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeSystem === 'inventory' && (
          <div className="inventory-system">
            <h2><Package className="icon-blue" /> Warehouse Management</h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Product Name</th>
                    <th>Price</th>
                    <th>Current Stock</th>
                    <th>Status</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map(item => (
                    <tr key={item.id}>
                      <td className="text-gray">#{item.id}</td>
                      <td className="font-medium">{item.name}</td>
                      <td>${item.price.toFixed(2)}</td>
                      <td className="font-bold">{item.stock}</td>
                      <td>
                        {item.stock > 10 ? <span className="status-badge healthy">Healthy</span> : 
                         item.stock > 0 ? <span className="status-badge low">Low Stock</span> : 
                         <span className="status-badge out">Out of Stock</span>}
                      </td>
                      <td className="text-right">
                        <button onClick={() => restockItem(item.id, 10)} className="restock-btn">
                          + Add 10 Units
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}