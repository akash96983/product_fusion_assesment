import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import './ProductPage.css';

// Product Card
const ProductCard = memo(({ product, onAddToCart }) => (
  <div className="product-card">
    <img src={product.image} alt={product.title} loading="lazy" />
    <h3>{product.title}</h3>
    <p>${product.price}</p>
    <button onClick={() => onAddToCart(product)}>Add to Cart</button>
  </div>
));

// Cart Item
const CartItem = memo(({ item, onRemove }) => (
  <div className="cart-item">
    <span>{item.title} x {item.quantity}</span>
    <span>${(item.price * item.quantity).toFixed(2)}</span>
    <button onClick={() => onRemove(item.id)}>Remove</button>
  </div>
));

// Loading Skeleton
const Loading = memo(() => (
  <div className="product-grid">
    {Array(8).fill().map((_, i) => (
      <div key={i} className="product-skeleton">
        <div className="skeleton-image" />
        <div className="skeleton-title" />
        <div className="skeleton-price" />
        <div className="skeleton-button" />
      </div>
    ))}
  </div>
));

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('');
  const [searchText, setSearchText] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cart')) || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch products
  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('https://fakestoreapi.com/products');
      setProducts(await res.json());
    } catch {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Debounce search
  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(searchText), 300);
    return () => clearTimeout(timeout);
  }, [searchText]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      (!category || p.category === category) &&
      (!debouncedSearch || p.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        p.description.toLowerCase().includes(debouncedSearch.toLowerCase()))
    );
  }, [products, category, debouncedSearch]);

  // Category list
  const categories = useMemo(() => [...new Set(products.map(p => p.category))], [products]);

  // Cart total
  const totalPrice = useMemo(() =>
    cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2), [cart]);

  // Handlers
  const addToCart = useCallback(product => {
    setCart(cart => {
      const exists = cart.find(item => item.id === product.id);
      return exists
        ? cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
        : [...cart, { ...product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback(id => {
    setCart(cart => cart.filter(item => item.id !== id));
  }, []);

  if (error) return (
    <div className="error-container">
      <h2>Error!</h2>
      <p>{error}</p>
      <button onClick={loadProducts}>Try Again</button>
    </div>
  );

  return (
    <div className="product-page">
      <header className="page-header">
        <h1>Product Store</h1>
        <p>Find your favorite products!</p>
      </header>

      {/* Filters */}
      <div className="filters">
        <input type="text" placeholder="Search..." onChange={e => setSearchText(e.target.value)} />
        <select value={category} onChange={e => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>      {/* Products */}
      {loading ? <Loading /> : (
        <div className="product-grid">
          {filteredProducts.map(p => (
            <ProductCard key={p.id} product={p} onAddToCart={addToCart} />
          ))}
        </div>
      )}

      {/* Cart */}
      <div className="cart">
        <h2>🛒 Cart</h2>
        {cart.length === 0 ? <p>Cart is empty</p> : (
          <>
            {cart.map(item => <CartItem key={item.id} item={item} onRemove={removeFromCart} />)}
            <div className="cart-total"><strong>Total: ${totalPrice}</strong></div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
