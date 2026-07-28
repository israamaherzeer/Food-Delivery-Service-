import { useState } from "react";

import style from "./addmenuItem.module.css";
import axios from "axios";
import type { MenuItem } from "../../types";

interface Iprops {
  onClose: () => void;
  onItemAdded: (newItem: MenuItem) => void;
}
const AddmenuItem = (props: Iprops) => {
  const [ItemData, setItemData] = useState({
    name: "",
    price: "",
    description: "",
    type: "",
    image_url: "",
  });
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { id, value } = e.target;
    setItemData((prev) => ({
      ...prev,
      [id]: id === "price" ? (value ? parseFloat(value) : "") : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/menu-items",
        ItemData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      props.onItemAdded(res.data.menuItem);
      props.onClose();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      alert(err.response?.data?.message || "Error adding item.");
    }
  };

  return (
    <div className={style.background}>
      <div className={style.card}>
        <div className={style.header}>
          <h6 className={style.title}>Add Item</h6>
          <button className={style.closeBtn} onClick={props.onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={style.section}>
            <label htmlFor="name" className={style.sectionLabel}>
              Item Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter Item Name"
              required
              value={ItemData.name}
              onChange={handleChange}
              className={style.input}
            />
          </div>
          <div className={style.section}>
            <label htmlFor="price" className={style.sectionLabel}>
              Item Price
            </label>
            <input
              id="price"
              type="number"
              placeholder="Enter Price"
              required
              value={ItemData.price}
              onChange={handleChange}
              min="1"
              className={style.input}
            />
          </div>
          <div className={style.section}>
            <label htmlFor="categoryName" className={style.sectionLabel}>
              Category Name
            </label>
            <select
              id="type"
              required
              value={ItemData.type}
              onChange={handleChange}
              className={style.select}
            >
              <option value="select category">Select a category</option>

              <option value="meals">meals</option>
              <option value="appetizers">appetizers</option>
              <option value="drinks">drinks</option>
            </select>
          </div>

          <div className={style.section}>
            <label htmlFor="image_url" className={style.sectionLabel}>
              choose Image
            </label>
            <input
              id="image_url"
              type="text"
              placeholder="Enter Item  Image"
              value={ItemData.image_url}
              onChange={handleChange}
              className={style.input}
            />
          </div>

          <div className={style.section}>
            <label htmlFor="description" className={style.sectionLabel}>
              Item Description
            </label>
            <textarea
              id="description"
              placeholder="Enter Item  Description"
              value={ItemData.description}
              onChange={handleChange}
              className={style.textarea}
            />
          </div>

          <div className={style.buttons}>
            <button type="submit" className={style.addbutton}>
              Add Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddmenuItem;
