export enum ProductType {
    Phone,
    Tablet,
    Watch,
    Earbuds
}

export enum ProductStatus {
    Completed,
    InProgress,
    Halted,
    Failed,
    Canceled
}

export interface Product {
    id: number;
    name: string;
    productType: ProductType;
    description: string;
    created: Date;
    status: ProductStatus;
}

export const getProductStatusColor = (status: ProductStatus): 'brand' | 'danger' | 'important' | 'informative' | 'severe' | 'subtle' | 'success' | 'warning' => {
    switch (status) {
        case ProductStatus.Completed:
            return "success";
        case ProductStatus.InProgress:
            return "warning";
        case ProductStatus.Halted:
            return "important";
        case ProductStatus.Failed:
            return "severe";
        case ProductStatus.Canceled:
            return "brand";
        default:
            return "subtle";
    }
}