import StockAlert from "./StockAlert";
import Summary from "./Summary";
import SalesReport from "./SalesReport";

const AdminHome = () => {
  return (
    <div className="mx-16 mt-8 mb-4">
      {/* Total inStock and inStock value  */}
      <Summary></Summary>
      <div className="my-8">
        {/* sales report for a interval  */}
        <SalesReport></SalesReport>
      </div>
      <div className="my-4">
        {/* stock alert report  */}
        <StockAlert></StockAlert>
      </div>
    </div>
  );
};

export default AdminHome;
