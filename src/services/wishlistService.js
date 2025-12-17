export const wishlistService = {
    getWishlist: async (userId) => {
        initializeData();
        const wishlist = JSON.parse(localStorage.getItem(STORAGE_KEYS.WISHLIST)) || [];
        const products = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS)) || [];

        // Filter by user and map to products
        const userWishlist = wishlist
            .filter(item => item.user_id === userId)
            .map(item => {
                const product = products.find(p => p.id === item.product_id);
                return product ? { ...product, wishlist_id: item.id } : null;
            })
            .filter(item => item !== null);

        return { data: userWishlist };
    },

    addToWishlist: async (userId, productId) => {
        initializeData();
        const wishlist = JSON.parse(localStorage.getItem(STORAGE_KEYS.WISHLIST)) || [];

        // Check if already in wishlist
        if (wishlist.some(item => item.user_id === userId && item.product_id === productId)) {
            throw new Error('Product already in wishlist');
        }

        const newItem = {
            id: getNextId(wishlist),
            user_id: userId,
            product_id: productId,
            created_at: new Date().toISOString()
        };

        wishlist.push(newItem);
        localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));

        return { data: { message: 'Added to wishlist' } };
    },

    removeFromWishlist: async (userId, productId) => {
        initializeData();
        const wishlist = JSON.parse(localStorage.getItem(STORAGE_KEYS.WISHLIST)) || [];
        const filteredWishlist = wishlist.filter(
            item => !(item.user_id === userId && item.product_id === productId)
        );

        localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(filteredWishlist));

        return { data: { message: 'Removed from wishlist' } };
    },

    checkWishlist: async (userId, productId) => {
        initializeData();
        const wishlist = JSON.parse(localStorage.getItem(STORAGE_KEYS.WISHLIST)) || [];
        const exists = wishlist.some(item => item.user_id === userId && item.product_id === productId);

        return { data: { exists } };
    }
};
