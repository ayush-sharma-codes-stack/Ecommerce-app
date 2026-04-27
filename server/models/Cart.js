import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  qty: { type: Number, required: true, min: 1, default: 1 },
  price: { type: Number, required: true },
  name: { type: String, required: true },
  image: { type: String },
});

const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: [cartItemSchema],
    totalPrice: { type: Number, default: 0 },
  },
  { timestamps: true }
);

cartSchema.methods.calcTotal = function () {
  this.totalPrice = this.items.reduce((acc, item) => acc + item.price * item.qty, 0);
  return this.totalPrice;
};

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;
