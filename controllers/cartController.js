const User = require('../models/userModel');
const Product = require('../models/productModel');
const Category = require('../models/categoryModel');
const Cart = require('../models/cartModel');












const loadCart = async (req, res) => {
  try {

      if(!req.session.users){
        res.render('cart.ejs', { carts: [], cartId: null  }) 
      }
      const userId = req.session.users._id;
     

      const userCart = await Cart.findOne({ userId }).populate('products.productId');
      

      
     
      if (userCart) {
          res.render('cart.ejs', { carts: userCart.products, cartId: userCart._id });
      } else {
         
          res.render('cart.ejs', { carts: [], cartId: null });
      }
  } catch (error) {
      console.log(error.message);
      
  }
};










const addToCart = async (req, res) => {
  try {
      const { productId, quantity } = req.body;

      
      if (!req.session.users) {
          return res.status(401).send('Please log in to add products to cart');
      }

     
      const product = await Product.findById(productId);

      
      if (!product || product.stock === 0) {
          return res.status(404).send('Product is out of stock');
      }

      let userCart = await Cart.findOne({ userId: req.session.users._id });

      if (!userCart) {
          userCart = new Cart({ userId: req.session.users._id, products: [] });
      }

      const existingProductIndex = userCart.products.findIndex(item => item.productId.toString() === productId);

      if (existingProductIndex !== -1) {
         
          return res.status(400).send('Product already added to cart');
      } else {
        console.log(product);
         
          await product.save();
          console.log(product);
          userCart.products.push({ productId, quantity: parseInt(quantity) });
          await userCart.save();
          return res.status(200).send('Product added to cart successfully');
      }
  } catch (error) {
      console.error(error);
      
  }
};




const removeFromCart = async(req,res)=>{
   try {
      const { cartId, productId } = req.body;

      

        const userCart = await Cart.findById(cartId);

    

        if (!userCart) {
            return res.status(404).json({ error: 'Cart not found' });
        }
        

        const existprod = userCart.products.findIndex(product => product.productId.toString() === productId);

        if ( existprod === -1) {
            return res.status(404).json({ error: 'Product not found in the cart' });
        }

        userCart.products.splice(existprod, 1);
        userCart.updatedAt = Date.now();
        await userCart.save();

     
        res.status(200).json({ message: 'Product removed from the cart successfully' });
      
   } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
   }
}





const updateQuantity = async (req, res) => {
    try {
      const { cartId, productId, quantity } = req.body;

      const product = await Product.find({_id:productId});

      
      const updatedCart = await Cart.findOneAndUpdate(
        { _id: cartId, 'products.productId': productId },
        { $set: { 'products.$.quantity': quantity } },
        { new: true }
      );
  
      // Calculate total price and grand total price
      let grandTotalPrice = 0;
      updatedCart.products.forEach(product => {
        grandTotalPrice += product.quantity * product.productId.prize;
      });
  
  
      // Send updated data back to the client
      res.json({ updatedCart, grandTotalPrice });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };





module.exports={
    loadCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    
   
}

