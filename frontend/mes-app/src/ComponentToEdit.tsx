import { FormEvent, JSX, useEffect, useState } from "react";
import {
    PhoneRegular,
    TabletRegular,
    SmartwatchRegular,
    SurfaceEarbudsRegular,
    DeviceMeetingRoomRegular,
    EditRegular,
    MoreHorizontalRegular,
    AddRegular,
    CameraRegular
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
    Button,
    Dialog,
    DialogSurface,
    DialogBody,
    DialogActions,
    DialogTrigger,
    DialogContent,
    DialogTitle,
    Label,
    Input,
    makeStyles,
    Combobox,
    Option
} from "@fluentui/react-components";
import type { JSXElement } from "@fluentui/react-components";
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import { Product, ProductStatus, getProductStatusColor, ProductType } from "./helper";
import './ComponentToEdit.css';

const useStyles = makeStyles({
    dialogContent: {
        marginTop: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "6px"
    },

    topMargin: {
        marginTop: "8px"
    }
});

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
        case ProductType.Webcam:
            return <CameraRegular />;
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
    const styles = useStyles(); 

    const [items, setItems] = useState<Product[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [product, setProduct] = useState<Product | null>(null);

    const [name, setName] = useState('');
    const [productType, setProductType] = useState<ProductType>(ProductType.Phone);
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState<ProductStatus>(ProductStatus.InProgress);

    const fetchData = async () => {
        const response = await fetch('http://localhost:5000/api/products')
        setItems(await response.json());
    }

    useEffect(() => {
        fetchData();
    }, []);

    const openCreateProductDialog = () => {
        setProduct(null);
        setName('');
        setProductType(ProductType.Phone);
        setDescription('');
        setStatus(ProductStatus.InProgress);
        setIsDialogOpen(true);
    }

    const openEditProductDialog = (product: Product) => {
        setProduct(product);
        setName(product.name);
        setProductType(product.productType);
        setDescription(product.description);
        setStatus(product.status);
        setIsDialogOpen(true);
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
       
        await fetch('http://localhost:5000/api/products' + (product ? `/${product.id}` : ''), {
            method: product ? 'PUT' : 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, productType, description, status }),
        });

        setProduct(null);
        setIsDialogOpen(false);
        fetchData();
    }

    return (
        <>
            <div className="products-header">
                <div></div>
                <div>
                    Products
                </div>
                <div className="header-right">
                    <Button icon={<AddRegular />} onClick={() => openCreateProductDialog()}>
                        Add
                    </Button>
                    <Dialog open={isDialogOpen} onOpenChange={(e, data) => setIsDialogOpen(data.open)}>
                        <DialogSurface aria-describedby={undefined}>
                            <form onSubmit={handleSubmit}>
                            <DialogBody>
                                <DialogTitle>{product ? 'Edit Product' : 'Add Product'}</DialogTitle>
                                <DialogContent className={styles.dialogContent}>
                                    <Label required htmlFor={"product-name-input"} className={styles.topMargin}>
                                        Name
                                    </Label>
                                    <Input required type="text" id={"product-name-input"} value={name} onChange={(e) => setName(e.target.value)} />
                                    
                                    <Label htmlFor={"product-description-input"} className={styles.topMargin}>
                                        Description
                                    </Label>
                                    <Input type="text" id={"product-description-input"} value={description} onChange={(e) => setDescription(e.target.value)} />
                                    
                                    <Label htmlFor={"product-type-select"} className={styles.topMargin}>
                                        Type
                                    </Label>
                                    <Combobox placeholder="Select product type" onOptionSelect={(event, data) => {
                                           if (data.optionValue) {
                                                setProductType(Number(data.optionValue) as ProductType);
                                            }
                                        }}
                                        value={ProductType[productType]}
                                        id={"product-type-select"}
                                    >
                                        {Object.entries(ProductType)
                                            .filter(([key]) => isNaN(Number(key)))
                                            .map(([key, value]) => (
                                                <Option key={key} value={String(value)} text={key}>
                                                    {key}
                                                </Option>
                                            ))}
                                    </Combobox>

                                    <Label htmlFor={"product-status-select"} className={styles.topMargin}>
                                        Status
                                    </Label>
                                    <Combobox placeholder="Select product status" onOptionSelect={(event, data) => {
                                           if (data.optionValue) {
                                                setStatus(Number(data.optionValue) as ProductStatus);
                                            }
                                        }}
                                        value={ProductStatus[status]}
                                        id={"product-status-select"}
                                    >
                                        {Object.entries(ProductStatus)
                                            .filter(([key]) => isNaN(Number(key)))
                                            .map(([key, value]) => (
                                                <Option key={key} value={String(value)} text={key}>
                                                    {key}
                                                </Option>
                                            ))}
                                    </Combobox>
                                </DialogContent>
                                <DialogActions className={styles.topMargin}>
                                    <DialogTrigger disableButtonEnhancement>
                                        <Button appearance="secondary">Cancel</Button>
                                    </DialogTrigger>
                                    <Button type="submit" appearance="primary">
                                        {product ? 'Update' : 'Add'}
                                    </Button>
                                </DialogActions>
                            </DialogBody>
                            </form>
                        </DialogSurface>
                    </Dialog>
                </div>
            </div>
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
                                        onClick={() => { openEditProductDialog(product); }}
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
