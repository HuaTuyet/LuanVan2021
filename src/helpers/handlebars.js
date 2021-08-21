const Handlebars = require('Handlebars');

module.exports = {
    sum: (a, b) => a + b,
    hinhthuc: (a) => Number(a) == 0 ? "%": "VNĐ",
    sosanhHT: (a) => Number(a) == 1 ? "selected": " ",
    hienthi:(a, b) => a == b ? "selected": " ",
    hienthimausac:(a, b) => a == b ? "checked": "",
    trangthai:(a) => Number(a) == 0 ? "Chờ xác nhận" : Number(a) == 1 ? "Đang chuẩn bị" : Number(a) == 2 ? "Đang giao" : Number(a) == 3 ? "Đã giao": "Đã hủy",
    thanhtoan:(a) => a == "cod" ? "Thanh toán sau khi nhận hàng (COD)" : a== "vnpay" ? "Thanh toán qua VNPay" : "Thanh toán bằng thẻ ATM nội địa / thẻ Quốc Tế (Visa, MasterCard, JCB)",
    thanhtien:(a, b) => Number(a) * Number(b),
    disabled:(a, b) => a == b ? "selected disabled":"",
    dateFormat: require('handlebars-dateformat'),
    hienthibutton: (a) => Number(a) == 0 ? "true" : false,
    matcactrangthai:(a) => Number(a) == 4 || Number(a) == 3 ? "true" : false,
    hienthicbox: (a) => Number(a),
    getmonth: (a) => a = new Date().getMonth() +1,
    getyear: (a) => a = new Date().getFullYear(),
    selectedCBO: (a, b) => a == b ? "selected" : "",

    // =========================== CUSTOMER ============================
    formatCurrency: (cur) => new Intl.NumberFormat('vn-VN', { style: 'currency', currency: 'VND' }).format(cur),
    formatCurrencyMulti: (cur, qty) => new Intl.NumberFormat('vn-VN', { style: 'currency', currency: 'VND' }).format(cur*qty),
    formatStatus: (status) => {
      if(status == 0){
        return "CHỜ XÁC NHẬN";
      }
      else if(status == 1){
        return "ĐANG CHUẨN BỊ";
      }
      else if(status == 2){
        return "ĐANG GIAO";
      }
      else if(status == 3){
        return "ĐÃ GIAO";
      }
      else if(status == 4){
        return "ĐÃ HỦY";
      }
    },
    formatHTThanhToan : (hinhthuc) => {
      if(hinhthuc == 'cod'){
        return "Thanh toán khi nhận hàng";
      }
      else if(hinhthuc == 'vnpay'){
        return "Thanh toán VNPAY";
      }
    },
    formatDate: (strDate) => strDate.toDateString(),
    getFirstCharacter: (str) => str.substr(0,1),
    hienthiHA: (a) => a == null ? "user.jpg" : a,
    ifCondEqual: (v1, v2, options) => {
        if(v1 == v2) {
          return options.fn(this); //return true
        }
        return options.inverse(this); //return false
    },
    hinhChiTiet: (arrayImg) => arrayImg[0].tenhinh
    // ifCond: (v1, v2, options) => {
    //     if(v1 != v2) {
    //       return options.fn(this); //return true
    //     }
    //     return options.inverse(this); //return false
    // },
}