import { useParams } from "react-router";

const SellerProductEdit = () => {
  const { id } = useParams();

  console.log("Product ID:", id);

  return (
    <div>
      Seller Product Edit
    </div>
  );
};

export default SellerProductEdit;