import { IProduct } from "./Product.type";
import "./ProductList.style.css";

type Props = {
  list: IProduct[];
  onDeleteClickHnd: (data: IProduct) => void;
  onEdit: (data: IProduct) => void;
};

const ProductList = (props: Props) => {
  const { list, onDeleteClickHnd, onEdit } = props;
  return (
    <div>
      <article>
        <h3 className="list-header">Product List</h3>
      </article>
    <table>
        <tr>
          <th>Name</th>
          <th>Price</th>
          <th>Action</th>
        </tr>
        {list.map((product) => {
          return (
            <tr key={product._id}>
              <td>{`${product.name}`}</td>
              <td>{product.price}</td>
              <td>
                <div>
                  <input
                    type="button"
                    value="Edit"
                    onClick={() => onEdit(product)}
                  />
                  <input
                    type="button"
                    value="Delete"
                    onClick={() => onDeleteClickHnd(product)}
                  />
                </div>
              </td>
            </tr>
          );
        })}
      </table>
      </div>
    );
}

export default ProductList;