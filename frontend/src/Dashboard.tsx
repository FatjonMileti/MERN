import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import Cookies from "universal-cookie";
const cookies = new Cookies();
import { IProduct } from "./Product.type"; 
import "./ProductList.style.css";
import "./Home.style.css";
import { useNavigate } from "react-router-dom";
import useFetch from "./useFetch";

const API_URL = "https://auth-backend.toni5107.repl.co/products";

const Dashboard = () => {
  const navigate = useNavigate();
  const token = cookies.get("TOKEN");
  const [products, setProducts] = useState<IProduct[]>([]);

  const { data: productList, isLoading, error, refetch } = useFetch({ url: API_URL, method: 'GET' });

  useEffect(() => {
    if (productList) {
      setProducts(productList);
    }
  }, [productList]);

  const onDeleteClickHnd = async (product: IProduct) => {
    try {
      const response = await fetch(`${API_URL}/${product._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const updatedList = productList.filter((p: any) => p._id !== product._id);
      setProducts(updatedList);
    } catch (error) {
      console.log(error);
    }
  };

  const onEdit = async (product: IProduct) => {
    const updatedName = prompt("Enter the updated name", product.name);
    const updatedPrice = prompt("Enter the updated price", product.price);

    if (updatedName && updatedPrice) {
      const updatedProduct = {
        ...product,
        name: updatedName,
        price: Number(updatedPrice),
      };
      try {
        const response = await fetch(`${API_URL}/${product._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedProduct),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const updatedList = productList.map((p) => {
          if (p._id === product._id) {
            return updatedProduct;
          } else {
            return p;
          }
        });
        setProducts(updatedList);
      } catch (error) {
        console.log(error);
      }
    }
  };
  
  return (
    <>
      <section className="section-content">
        <Link to="/addProduct">
          <button className="add-product-btn">Add Product</button>
        </Link>
      </section>
      {isLoading && <p>Loading...</p>}
      {error && <p>{error.message}</p>}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product: IProduct) => {
            return (
              <tr key={product._id}>
                <td>{product.name}</td>
                <td>{product.price}</td>
                <td>
                  <button onClick={() => onDeleteClickHnd(product)}>Delete</button>
                  <button onClick={() => onEdit(product)}>Edit</button>
                </td>
                </tr>
              );
      })}
    </tbody>
  </table>
</>
    );
};

export default Dashboard;