import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './DataDashboard.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function DataDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');  // Simple function to get products with caching
  async function getProducts() {
    try {
      setLoading(true);
      setError('');
      
      // Check localStorage cache first
      const cachedData = localStorage.getItem('dashboardProducts');
      const cachedTime = localStorage.getItem('dashboardCacheTime');
      
      if (cachedData && cachedTime) {
        const cacheAge = Date.now() - parseInt(cachedTime);
        // Use cache if less than 5 minutes old (300000 ms)
        if (cacheAge < 300000) {
          setProducts(JSON.parse(cachedData));
          setLoading(false);
          return;
        }
      }
      
      const response = await fetch('https://fakestoreapi.com/products');
      const data = await response.json();
      
      // Add mock dates for trend analysis
      const productsWithDates = data.map((product, index) => ({
        ...product,
        date: new Date(Date.now() - (data.length - index) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }));
      
      setProducts(productsWithDates);
      
      // Save to localStorage
      localStorage.setItem('dashboardProducts', JSON.stringify(productsWithDates));
      localStorage.setItem('dashboardCacheTime', Date.now().toString());
      
      setLoading(false);
    } catch (err) {
      setError('Could not load products');
      setLoading(false);
    }
  }

  // Load products when page loads
  useEffect(() => {
    getProducts();
  }, []);
  // Filter products by category and date range
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesStartDate = !startDate || product.date >= startDate;
    const matchesEndDate = !endDate || product.date <= endDate;
    return matchesCategory && matchesStartDate && matchesEndDate;
  });
  // Simple stats
  const totalProducts = filteredProducts.length;
  const totalPrice = filteredProducts.reduce((sum, product) => sum + product.price, 0);
  const avgPrice = totalProducts > 0 ? (totalPrice / totalProducts).toFixed(2) : 0;
  const avgRating = totalProducts > 0 ? (filteredProducts.reduce((sum, product) => sum + (product.rating?.rate || 0), 0) / totalProducts).toFixed(1) : 0;

  // Simple chart data showing trends over time
  const chartData = {
    labels: filteredProducts.map(product => product.date),
    datasets: [
      {
        label: 'Price Trend',
        data: filteredProducts.map(product => product.price),
        borderColor: 'blue',
        backgroundColor: 'lightblue',
        borderWidth: 2,
        fill: false,
      },
    ],
  };
  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Product Price Trends Over Time'
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Price ($)'
        }
      }
    }
  };
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
        <button onClick={getProducts}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h1>Product Dashboard</h1>
        <div className="filter-section">
        <label>Filter by Category: </label>
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          <option value="all">All</option>
          <option value="electronics">Electronics</option>
          <option value="jewelery">Jewelery</option>
          <option value="men's clothing">Men's Clothing</option>
          <option value="women's clothing">Women's Clothing</option>
        </select>
        
        <label>Start Date: </label>
        <input 
          type="date" 
          value={startDate} 
          onChange={(e) => setStartDate(e.target.value)}
        />
        
        <label>End Date: </label>
        <input 
          type="date" 
          value={endDate} 
          onChange={(e) => setEndDate(e.target.value)}
        />
        
        <button onClick={getProducts}>Refresh</button>
      </div>      <div className="stats-section">
        <div className="stat-box">
          <h3>Total Products</h3>
          <p>{totalProducts}</p>
        </div>
        <div className="stat-box">
          <h3>Total Price</h3>
          <p>${totalPrice.toFixed(2)}</p>
        </div>
        <div className="stat-box">
          <h3>Average Price</h3>
          <p>${avgPrice}</p>
        </div>
        <div className="stat-box">
          <h3>Average Rating</h3>
          <p>{avgRating}</p>
        </div>
      </div>      <div className="chart-section">
        <h2>Price Trend Chart</h2>
        {filteredProducts.length > 0 ? (
          <Line data={chartData} options={chartOptions} />
        ) : (
          <p>No data to show</p>
        )}
      </div>      <div className="table-section">
        <h2>Products List</h2>
        {filteredProducts.length > 0 ? (
          <table>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Rating</th>
              <th>Date Added</th>
            </tr>
            {filteredProducts.map(product => (
              <tr key={product.id}>
                <td>{product.title.substring(0, 30)}...</td>
                <td>{product.category}</td>
                <td>${product.price}</td>
                <td>{product.rating ? product.rating.rate : 'N/A'}</td>
                <td>{product.date}</td>
              </tr>
            ))}
          </table>
        ) : (
          <p>No products found</p>
        )}
      </div>
    </div>
  );
}

export default DataDashboard;