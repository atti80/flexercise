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
    CameraRegular,
    DeleteRegular
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
    Combobox,
    Option,
    Menu,
    MenuTrigger,
    MenuList,
    MenuItem,
    MenuPopover,
    SearchBox
} from "@fluentui/react-components";
import type { InputOnChangeData, JSXElement, SearchBoxChangeEvent } from "@fluentui/react-components";
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import { Product, ProductStatus, getProductStatusColor, ProductType } from "./helper";
import { useStyles } from "./ComponentToEdit.styles";

TimeAgo.addDefaultLocale(en)
const timeAgo = new TimeAgo('en-US')

const formatDateYYYYMMDD = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

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
    const [filteredItems, setFilteredItems] = useState<Product[]>([]);

    const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [product, setProduct] = useState<Product | null>(null);

    const [name, setName] = useState('');
    const [productType, setProductType] = useState<ProductType>(ProductType.Phone);
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState<ProductStatus>(ProductStatus.InProgress);

    const [searchText, setSearchText] = useState('');

    const fetchData = async () => {
        const response = await fetch('http://localhost:5000/api/products')
        const jsonResult = await response.json();
        setItems(jsonResult);
        setFilteredItems(jsonResult);
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
        setIsProductDialogOpen(true);
    }

    const openEditProductDialog = (product: Product) => {
        setProduct(product);
        setName(product.name);
        setProductType(product.productType);
        setDescription(product.description);
        setStatus(product.status);
        setIsProductDialogOpen(true);
    }

    const openDeleteProductDialog = (product: Product) => {
        setProduct(product);
        setIsDeleteDialogOpen(true);
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
       
        const response = await fetch('http://localhost:5000/api/products' + (product ? `/${product.id}` : ''), {
            method: product ? 'PUT' : 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, productType, description, status }),
        });

        if (!response.ok) {
            console.error(`Failed to ${product ? 'update' : 'create'} product`);
            return;
        }

        setProduct(null);
        setIsProductDialogOpen(false);
        await fetchData();
    }

    const handleDelete = async () => {
        if (!product)
            return;
        
        const response = await fetch(`http://localhost:5000/api/products/${product.id}`, { method: 'DELETE' });

        if (!response.ok) {
            console.error('Failed to delete product');
            return;
        }

        setIsDeleteDialogOpen(false);
        setProduct(null);
        await fetchData();
    }

    const OnSearchInputChanged = (event: SearchBoxChangeEvent, data: InputOnChangeData) => {
        setSearchText(data.value);
        if (!data.value)
            setFilteredItems(items);
    }

    const handleSearch = () => {
        setFilteredItems(items.filter((product: Product)  => 
            (product.name.toLowerCase().includes(searchText.toLowerCase()) || product.description?.toLowerCase().includes(searchText.toLowerCase())
        )));
    }

    return (
        <>
            <div className={styles.productsHeader}>
                <div className={styles.headerLeft}>
                    <img src="logo192.png" alt="logo"/>
                </div>
                <div>
                    Products
                </div>
                <div className={styles.headerRight}>
                    <Button icon={<AddRegular />} onClick={() => openCreateProductDialog()}>
                        Add
                    </Button>
                    <Dialog open={isProductDialogOpen} onOpenChange={(e, data) => setIsProductDialogOpen(data.open)}>
                        <DialogSurface className={styles.productDialog} aria-describedby={undefined}>
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
                    <div className={styles.searchContainer}>
                        <SearchBox onChange={OnSearchInputChanged} className={styles.searchBox} />
                        <Button onClick={handleSearch}>Search</Button>
                    </div>
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
                    {filteredItems.map((product: Product) => (
                        <TableRow key={product.id}>
                            <TableCell>
                                <TableCellLayout>
                                    {product.name}
                                </TableCellLayout>
                                <TableCellActions>
                                    <Menu>
                                        <MenuTrigger disableButtonEnhancement>
                                            <Button
                                                icon={<MoreHorizontalRegular />}
                                                appearance="subtle"
                                                aria-label="More actions"
                                            />
                                        </MenuTrigger>
                                        <MenuPopover>
                                            <MenuList>
                                                <MenuItem icon={<EditRegular />} onClick={() => openEditProductDialog(product)}>Edit</MenuItem>
                                                <MenuItem icon={<DeleteRegular />} onClick={() => openDeleteProductDialog(product)}>Delete</MenuItem>
                                            </MenuList>
                                        </MenuPopover>
                                    </Menu>
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
            <Dialog open={isDeleteDialogOpen} onOpenChange={(e, data) => setIsDeleteDialogOpen(data.open)}>
                <DialogSurface>
                    <DialogBody>
                    <DialogTitle>
                        Delete Product
                    </DialogTitle>
                    <DialogContent>
                        Are you sure you want to delete this product?
                    </DialogContent>
                    <DialogActions>
                        <DialogTrigger disableButtonEnhancement>
                            <Button appearance="secondary">Cancel</Button>
                        </DialogTrigger>
                        <Button appearance="primary" onClick={handleDelete}>Delete</Button>
                    </DialogActions>
                    </DialogBody>
                </DialogSurface>
            </Dialog>
            <footer className={styles.footer}>
                {formatDateYYYYMMDD(new Date())}
            </footer>
        </>
    );
};
