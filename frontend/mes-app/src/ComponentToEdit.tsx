import { JSX, useEffect, useState } from "react";
import {
    PhoneRegular,
    TabletRegular,
    SmartwatchRegular,
    SurfaceEarbudsRegular,
    DeviceMeetingRoomRegular,
    EditRegular,
    MoreHorizontalRegular
} from "@fluentui/react-icons";
import {
    TableBody,
    TableCell,
    TableRow,
    Table,
    TableHeader,
    TableHeaderCell,
    TableCellLayout, Badge,
    TableCellActions,
    Button
} from "@fluentui/react-components";
import type { JSXElement } from "@fluentui/react-components";
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import { Product, ProductStatus, getProductStatusColor, ProductType } from "./helper";

TimeAgo.addDefaultLocale(en)
const timeAgo = new TimeAgo('en-US')

const getProductIcon = (productType: ProductType): JSX.Element => {
    switch (productType) {
        case ProductType.Phone:
            return <PhoneRegular />;
        case ProductType.Tablet:
            return <TabletRegular />;
        case ProductType.Watch:
            return <SmartwatchRegular />;
        case ProductType.Earbuds:
            return <SurfaceEarbudsRegular />;
        default:
            return <DeviceMeetingRoomRegular />;
    }
};

const columns = [
    { columnKey: "product", label: "Product" },
    { columnKey: "type", label: "Type" },
    { columnKey: "status", label: "Status" },
    { columnKey: "description", label: "Description" },
    { columnKey: "created", label: "Created" },
];

export const ComponentToEdit = (): JSXElement => {
    const [items, setItems] = useState<Product[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('http://localhost:5000/api/products')

            setItems(await response.json());
        }
        fetchData();

    }, []);

    return (
        <>
            <div style={{ backgroundColor: "#f0f0f0", color: "#000", padding: 10 }}>Products</div>
            <Table arial-label="Default table" style={{ minWidth: "510px" }}>
                <TableHeader>
                    <TableRow>
                        {columns.map((column) => (
                            <TableHeaderCell key={column.columnKey}>
                                {column.label}
                            </TableHeaderCell>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map((product: Product) => (
                        <TableRow key={product.id}>
                            <TableCell>
                                <TableCellLayout>
                                    {product.name}
                                </TableCellLayout>
                                <TableCellActions>
                                    <Button
                                        icon={<EditRegular />}
                                        appearance="subtle"
                                        aria-label="Edit"
                                    />
                                    <Button
                                        icon={<MoreHorizontalRegular />}
                                        appearance="subtle"
                                        aria-label="More actions"
                                    />
                                </TableCellActions>
                            </TableCell>
                            <TableCell>
                                <TableCellLayout media={getProductIcon(product.productType)}>
                                    {ProductType[product.productType]}
                                </TableCellLayout>
                            </TableCell>
                            <TableCell>
                                <TableCellLayout>
                                    <Badge role="img" title={ProductStatus[product.status]} aria-label="Active" appearance="filled" color={getProductStatusColor(product.status)} />
                                </TableCellLayout>
                            </TableCell>
                            <TableCell>
                                <TableCellLayout>
                                    {product.description}
                                </TableCellLayout>
                            </TableCell>
                            <TableCell>
                                <TableCellLayout>
                                    {timeAgo.format(new Date(product.created))}
                                </TableCellLayout>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    );
};
