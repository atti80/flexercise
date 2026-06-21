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

    searchContainer: {
        display: "flex",
        gap: "4px"
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

    searchBox: {
        width: "200px"
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