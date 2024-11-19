// InvoicePDF.jsx
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import logo from "../assets/bossTradings.png";
import signature from "../assets/signature.png";

// Define styles for the PDF document
const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 12 },
  section: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  title: { fontSize: 24, marginBottom: 10, textAlign: "center" },
  logo: { width: 100, height: 100, marginLeft: 24 },
  companyInfo: { fontSize: 14, textAlign: "right" },
  customerInfo: { marginTop: 10, marginBottom: 10 },
  customerText: { marginBottom: 3 },
  // -------- table start --------------
  table: {
    display: "flex",
    flexDirection: "column",
    marginTop: 10,
    borderTop: "1px solid #000",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    borderBottom: "1px solid #000",
    paddingVertical: 5,
  },
  cellHeader: {
    fontWeight: "bold",
    fontSize: 12,
  },
  cell: {
    fontSize: 10,
  },
  cellProduct: {
    flex: 1, // Takes the remaining space
    paddingLeft:"8px"
  },
  cellFixed: {
    width: 64, // Fixed width for the other columns
    textAlign: "center",
  },
  // -------- table end --------------
  totalSection: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
    marginRight: 8,
  },
  totalText: { fontSize: 14, fontWeight: "bold" },
  signatureSection: {
    marginTop: 72,
    // paddingRight: 16,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    gap: "8px",
    width: "100%",
  },
  signatureImage: { width: 100, height: 40, marginTop: 5 },
});

const InvoicePDF = ({
  selectedCustomer,
  selectedProducts,
  totalPrice,
  invoiceNumber,
  date,
}) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header with Logo and Invoice Title */}
        <View style={styles.header}>
          <Image src={logo} style={styles.logo} />
          <View style={styles.companyInfo}>
            <Text>Boss Tradings</Text>
            <Text>Kazi Riaz Uddin Road, Keller Mor, Lalbagh, Dhaka</Text>
            <Text>Phone: 01710-260194</Text>
            <Text>Email: mdmamun190194@gmail.com</Text>
          </View>
        </View>

        <Text style={styles.title}>Sales Invoice</Text>

        {/* Invoice Number and Date */}
        <View style={styles.section}>
          <Text>Issued Date: {new Date(date).toLocaleDateString("en-CA")}</Text>
          <Text>Invoice Number: {invoiceNumber}</Text>
        </View>

        {/* Customer Information */}
        <View style={styles.customerInfo}>
          <Text style={styles.customerText}>
            Customer Name: {selectedCustomer?.name || "N/A"}
          </Text>
          <Text style={styles.customerText}>
            Mobile: {selectedCustomer?.mobile || "N/A"}
          </Text>
          <Text style={styles.customerText}>
            Address: {selectedCustomer?.address || "N/A"}
          </Text>
        </View>

        {/* Table */}
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.row}>
            <Text style={[styles.cellHeader, styles.cellProduct]}>Product</Text>
            <Text style={[styles.cellHeader, styles.cellFixed]}>Price</Text>
            <Text style={[styles.cellHeader, styles.cellFixed]}>Quantity</Text>
            <Text style={[styles.cellHeader, styles.cellFixed]}>Total</Text>
          </View>

          {/* Product Rows */}
          {selectedProducts.map((product, index) => (
            <View key={index} style={styles.row}>
              <Text style={[styles.cell, styles.cellProduct]}>
                {index + 1}. {product.productName}
              </Text>
              <Text style={[styles.cell, styles.cellFixed]}>
                {product.price.toFixed(2)}
              </Text>
              <Text style={[styles.cell, styles.cellFixed]}>
                {product.quantity}
              </Text>
              <Text style={[styles.cell, styles.cellFixed]}>
                {(product.price * product.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        {/* Total Price */}
        <View style={styles.totalSection}>
          <Text style={styles.totalText}>
            Total Price: {totalPrice.toFixed(2)}
            {" /="}
          </Text>
        </View>

        {/* Signature Section */}
        <View style={styles.signatureSection}>
          <Text>Authorized Signature</Text>
          <Image src={signature} style={styles.signatureImage} />
          <Text>________________________</Text>
          <Text>Managing Director & CEO</Text>
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePDF;
