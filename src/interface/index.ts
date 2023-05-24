export type User = {
    username: string;
    password: string;
    captcha: string;
}
export type Product = {
    categoryName: string,
    createDate: string,
    id:number,
    manufacturers: string,
    name: string,
    nowPrice: number,
    price: number,
    saleCount: number,
    stock: number,
    yieldDate: string
}
export type Category = {
    id:number
    name:string
    recommend:string
}

export type Sale = {
    id: number,
    saleCount: number,
    createDate: string,
    product: Product
}

export type ProductDto = {
    name: string | undefined,
    categoryName: string | undefined,
    startYieldDate: string | undefined,
    endYieldDate: string | undefined,
}

export type SaleDto = {
    categoryName: string | undefined,
    startCreateDate: string | undefined,
    endCreateDate: string | undefined
}

export type PageAble = {
    page: number,
    limit: number | undefined,
    sort: string | undefined,
    sortColumn: string | undefined
} | any
