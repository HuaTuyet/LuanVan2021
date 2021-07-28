module.exports = function Cart(cart) {
    this.items = cart.items || {};
    this.totalItems = cart.totalItems || 0;
    this.totalPrice = cart.totalPrice || 0;

    this.add = function(item, id) {
        var cartItem = this.items[id];
        if (!cartItem) {
            cartItem = this.items[id] = {item: item, quantity: 0, price: 0};
        }
        cartItem.quantity++;
        cartItem.price = cartItem.item.giagoc * cartItem.quantity;
        this.totalItems++;
        this.totalPrice += cartItem.item.giagoc;
    };

    this.getCart = function(item, id){
        var cartItem = this.items[id] = {item: item, quantity: 0, price: 0};
        cartItem.quantity = item.soluong;
        cartItem.price = item.giagoc * item.soluong;
        this.totalPrice += cartItem.price;
        this.totalItems += cartItem.quantity;
    }

    this.remove = function(id) {
        this.totalItems -= this.items[id].quantity;
        this.totalPrice -= this.items[id].price;
        delete this.items[id];
    };

    this.getItems = function() {
        var arr = [];
        for (var id in this.items) {
            arr.push(this.items[id]);
        }
        return arr;
    };

    this.updateQuantity = function(id, quantity){
        this.totalItems -= this.items[id].quantity;
        this.totalPrice -= this.items[id].price;
        let cartItem = this.items[id];
        cartItem.quantity = Number(quantity);
        cartItem.price = cartItem.item.giagoc * cartItem.quantity;
        this.totalItems += Number(this.items[id].quantity);
        this.totalPrice += cartItem.price;
    }
}