export type User = {
    username: string,
    password: string,
    captcha: string,
    uuid: number
}
export interface Product {
    categoryName: string;
    createDate: string;
    id:number;
    manufacturers: string;
    name: string;
    nowPrice: number;
    price: number;
    saleCount: number;
    stock: number;
    yieldDate: string;
    count: number;
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
export type SaleData = 
{
  "id": number,
  "createDate": string,
  "products": Product[],
  "saleProducts": 
    {
      "id": number,
      "count": number
    }[]
}
export type ResponseData<T> = {
    "content": T,
    "pageable": {
      "sort": {
        "empty": boolean,
        "sorted": boolean,
        "unsorted": boolean
      },
      "offset": number,
      "pageNumber": number,
      "pageSize": number,
      "unpaged": number,
      "paged": number
    },
    "last": number,
    "totalPages": number,
    "totalElements": number,
    "size": number,
    "number": number,
    "sort": {
      "empty": boolean,
      "sorted": boolean,
      "unsorted": boolean
    },
    "first": boolean,
    "numberOfElements": number,
    "empty": boolean
} | {}
export type PageAble = {
    page: number,
    limit: number | undefined,
    sort: string | undefined,
    sortColumn: string | undefined
} | any
