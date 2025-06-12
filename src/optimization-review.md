1. Split Product Card and Cart Item into Separate Memoized Components
Change: Created <ProductCard /> and <CartItem /> as separate components and used React.memo.

Why: This avoids unnecessary re-renders. If props don’t change, React skips re-rendering the component. This improves performance especially when the product list or cart grows.

2. Used useCallback for Event Handlers
Change: Wrapped addToCart, removeFromCart, and loadProducts in useCallback.

Why: It helps React remember the function reference between renders. This prevents re-rendering of memoized child components and makes the app faster and smoother.

3. Implemented Debounced Search
Change: Used a timeout to update the actual search value (debouncedSearch) after 300ms.

Why: Without this, the search filters products on every key press which can be slow. Debouncing waits until the user stops typing, reducing the number of times we filter.

4. Used useMemo for Derived Values
Change: Used useMemo for categories, filteredProducts, and totalPrice.

Why: These values only update when dependencies change, so calculations are not repeated unnecessarily. This boosts performance and reduces re-renders.

5. Improved Code Structure and Readability
Change: Moved loading skeleton, product cards, and cart items into their own components.

Why: Keeps the main ProductPage component clean and easier to read or debug. Good code structure also makes the file easier to maintain or extend later.