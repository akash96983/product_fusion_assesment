# Product Store App

A simple React app that shows products from an online store. You can browse products, add them to cart, and see data charts.

## What This App Does

- **Product Page**: Shows products from a fake store API
- **Shopping Cart**: Add/remove products and see total price
- **Dashboard**: Shows charts and data about products


## Features

### Product Page
- Browse all products
- Search products by name
- Filter by category (electronics, clothing, etc.)
- Add products to shopping cart
- See cart total and remove items

### Dashboard
- View product statistics
- See price trends in a chart
- Filter data by category and date
- View all products in a table

## Technologies Used

- **React** - For the user interface
- **Vite** - For fast development
- **Chart.js** - For making charts
- **CSS** - For simple styling

## Project Structure

```
src/
  App.jsx          - Main app with navigation
  ProductPage.jsx  - Product store page
  DataDashboard.jsx - Charts and data page
  *.css           - Styling files
```

## Performance Features

The app uses these React features to run faster:
- `React.memo` - Prevents unnecessary re-renders
- `useCallback` - Remembers functions between renders
- `useMemo` - Remembers calculated values
- Debounced search - Waits before searching as you type

## Data Source

Products come from: https://fakestoreapi.com/products

The app saves your cart in browser storage so it remembers your items when you refresh the page.


