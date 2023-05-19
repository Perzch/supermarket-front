
interface Api {
    [key: string]: string
}
export const api:Api = {
    category: 'category',
    categoryNames: 'category/names',
    login: 'auth',
    captcha: 'auth/captcha',
    product: 'product',
    productIds: 'product/ids',
    productNames:'product/names',
    sale: 'sale',
    printSale: 'print/sale',//待开发
    printSales: 'print/sales'
}
export default api