import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Product): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const ASYNC_KEY = '@GoMarketPlace:cart';

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      const storagedProducts = await AsyncStorage.getItem(ASYNC_KEY);

      if (storagedProducts) {
        const parsedStoragedProducts = JSON.parse(storagedProducts);

        setProducts(parsedStoragedProducts);
      }
    }

    loadProducts();
  }, []);
  const increment = useCallback(
    async id => {
      const newProducts = products.map(product => {
        if (product.id === id) {
          const newQuantity = product.quantity + 1;
          return {
            ...product,
            quantity: newQuantity,
          };
        }
        return product;
      });

      setProducts(newProducts);

      await AsyncStorage.setItem(ASYNC_KEY, JSON.stringify(newProducts));
    },
    [products],
  );

  const decrement = useCallback(
    async id => {
      const newProducts = products.map(product => {
        if (product.quantity >= 0 && product.id === id) {
          const newQuantity = product.quantity - 1;
          return {
            ...product,
            quantity: newQuantity,
          };
        }
        return product;
      });
      setProducts(newProducts);

      await AsyncStorage.setItem(ASYNC_KEY, JSON.stringify(newProducts));
    },
    [products],
  );

  const addToCart = useCallback(
    async product => {
      const productExists = products.find(prod => prod.id === product.id);

      if (productExists) {
        increment(product.id);
        return;
      }

      const newProduct = {
        ...product,
        quantity: 1,
      };

      setProducts(prevState => [...prevState, newProduct]);

      await AsyncStorage.setItem(ASYNC_KEY, JSON.stringify(products));
    },
    [products, increment],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
