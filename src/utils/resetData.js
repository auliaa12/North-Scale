// Utility to reset localStorage data
// Run this in browser console if you want to reset all data

export const resetLocalStorage = () => {
  const confirm = window.confirm(
    'This will reset all data including products, cart, and orders. Continue?'
  );
  
  if (confirm) {
    // Clear all ecommerce data
    const keys = [
      'ecommerce_products',
      'ecommerce_categories',
      'ecommerce_cart',
      'ecommerce_orders',
      'ecommerce_users',
      'ecommerce_wishlist',
      'ecommerce_chat_conversations',
      'ecommerce_chat_messages',
      'ecommerce_initialized'
    ];
    
    keys.forEach(key => {
      localStorage.removeItem(key);
    });
    
    // Reload to reinitialize
    window.location.reload();
  }
};

// Utility to clean up product images to free storage space
export const cleanupProductImages = () => {
  try {
    const products = JSON.parse(localStorage.getItem('ecommerce_products')) || [];
    let cleanedCount = 0;
    let totalSizeBefore = 0;
    let totalSizeAfter = 0;

    const cleanedProducts = products.map(product => {
      // Calculate size before
      const productSize = JSON.stringify(product).length;
      totalSizeBefore += productSize;

      // Keep only first image (main image) and remove others
      if (product.images && product.images.length > 1) {
        product.images = [product.images[0]]; // Keep only first image
        product.main_image = product.images[0]?.image_path || '/placeholder-product.jpg';
        cleanedCount++;
      }

      // Calculate size after
      const newProductSize = JSON.stringify(product).length;
      totalSizeAfter += newProductSize;

      return product;
    });

    localStorage.setItem('ecommerce_products', JSON.stringify(cleanedProducts));
    
    const savedKB = ((totalSizeBefore - totalSizeAfter) / 1024).toFixed(2);
    alert(`Cleaned up ${cleanedCount} products. Saved approximately ${savedKB} KB.`);
    return { cleaned: cleanedCount, savedKB };
  } catch (error) {
    console.error('Error cleaning up images:', error);
    alert('Failed to clean up images: ' + error.message);
    return { error: error.message };
  }
};

// Make it available globally in dev mode
if (import.meta.env.DEV) {
  window.resetLocalStorage = resetLocalStorage;
  window.cleanupProductImages = cleanupProductImages;
}



