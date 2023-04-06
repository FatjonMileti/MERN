import { useState } from "react";
import Cookies from "universal-cookie";
const cookies = new Cookies();
import { IProduct } from "./Product.type";
import "./ProductList.style.css";

interface Props {
  onAddProduct: (product: IProduct) => void;
}

const API_URL = "https://auth-backend.toni5107.repl.co/products";

const AddProduct = ({ onAddProduct }: Props) => {
  const token = cookies.get("TOKEN");
  /*if (!token) {
    window.location.href = "/";
  }*/

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newProduct = {
      name,
      price: Number(price),
    };

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newProduct),
    });
    const data = await response.json();
    console.log(data);

    onAddProduct(data);

    setName("");
    setPrice("");
    
  };

  return (
    <form onSubmit={onSubmit}>
      <div>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <hr />
      <div>
        <label htmlFor="price">Price:</label>
        <input
          type="number"
          id="price"
          name="price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <hr />
      </div>
      <button type="submit">Add Product</button>
    </form>
  );
};

export default AddProduct;