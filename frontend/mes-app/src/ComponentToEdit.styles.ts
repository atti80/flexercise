import { makeStyles } from "@fluentui/react-components";

export const useStyles = makeStyles({
    productsHeader: {
        backgroundColor: "#f0f0f0",
        color: "#000",
        padding: "10px",
        display: "grid",
        gridTemplateColumns: "1fr auto 1fr",
        alignItems: "center",
        justifyItems: "space-between"
    },

    headerRight: {
        display: "flex",
        justifyContent: "flex-end",
        gap: "20px"
    },

    headerLeft: {
        display: "flex",
        justifyContent: "flex-start",
        
        "& img": {
            width: "30px",
        },
    },

    addButton: {
        minWidth: "auto",
        "@media (max-width: 1024px)": {
            paddingLeft: "4px",
            paddingRight: "4px",
        },
        "& span": {
            margin: "0px",
        }
    },

    addButtonText: {
        "@media (max-width: 1024px)": {
            display: "none"
        },
    },

    searchContainer: {
        display: "flex",
        gap: "4px"
    },

    searchButton: {
        "@media (max-width: 1024px)": {
            display: "none"
        },
    },

    searchBox: {
        width: "200px",
        "@media (max-width: 640px)": {
            width: "120px",
        },
    },

    productDialog: {
        width: "400px"
    },

    dialogContent: {
        marginTop: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "6px"
    },

    topMargin: {
        marginTop: "8px"
    },

    footer: {
        display: "flex",
        justifyContent: "center",
        padding: "10px"
    }
});