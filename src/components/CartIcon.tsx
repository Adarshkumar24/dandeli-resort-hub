import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const CartIcon = () => {
  const { state } = useCart();

  return (
    <Link to="/cart">
      <Button variant="ghost" size="sm" className="relative p-2">
        <ShoppingCart size={20} />
        {state.itemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
            {state.itemCount > 9 ? '9+' : state.itemCount}
          </span>
        )}
      </Button>
    </Link>
  );
};

export default CartIcon;
