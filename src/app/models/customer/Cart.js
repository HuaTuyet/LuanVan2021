module.exports = function Cart(oldCart){
    this.items = oldCart.items || {}; 
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;

    this.add = function(item, id, productQty){
        var storedItem = this.items[id];
        if(!storedItem){
            storedItem = this.items[id] = {item: item, qty: 0, price: 0};
        }
        storedItem.qty += productQty;
        storedItem.price = storedItem.item.giagiam > 0 ? storedItem.item.giagiam : storedItem.item.giaban;
        //storedItem.price = price * storedItem.qty;
        this.totalQty += productQty;
        this.totalPrice += storedItem.price * storedItem.qty; 
    }; 
    this.generateArray = function(){
        var arr = [];
        for(var id in this.items){
            arr.push(this.items[id]);
        }
        return arr;
    }
    this.delete = function(id){
        this.totalQty -= this.items[id].qty;
        this.totalPrice -= (this.items[id].price*this.items[id].qty);
        delete this.items[id];
    }; 
    this.update = function(id, qty){
        var storedItem = this.items[id];
        if(qty == 'plus'){
            storedItem.qty++;
            storedItem.price = storedItem.item.giagiam > 0 ? storedItem.item.giagiam : storedItem.item.giaban;
            //storedItem.price = price * storedItem.qty;
            this.totalQty++;
            this.totalPrice += storedItem.price;
        }
        else if(qty == 'minus'){
            storedItem.qty--;
            storedItem.price = storedItem.item.giagiam > 0 ? storedItem.item.giagiam : storedItem.item.giaban;
            //storedItem.price = price * storedItem.qty;
            this.totalQty--;
            this.totalPrice -= storedItem.price;
        }
    }; 
}