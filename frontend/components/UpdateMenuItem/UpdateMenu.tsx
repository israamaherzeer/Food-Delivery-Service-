import { useState, useEffect } from "react";
import { MenuItem } from "../../types";
import style from './UpdateMenuItem.module.css'
import axios from "axios";


interface UpdateMenuItemProps {
  initialData: MenuItem; 
  onClose: () => void;
  onItemUpdated: (updatedItem: MenuItem) => void;
}

const UpdateMenuItem = ({
  initialData,
  onClose,
  onItemUpdated,
}: UpdateMenuItemProps) => {
  const [ItemData, setItemData] = useState({
    name: "",
    price: "",
    description: "",
    type: "",
    image_url: "",
  });

  useEffect(() => {
    if (initialData) {
      setItemData({
        name: initialData.name,
        price: initialData.price.toString(),
        description: initialData.description,
        type: initialData.type,
        image_url: initialData.image_url,
      });
    }
  }, [initialData]);

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
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const res = await axios.put(
      `http://localhost:5000/menu-items/${initialData._id}`,
      {
        name: ItemData.name,
        description: ItemData.description,
        price: parseFloat(ItemData.price as unknown as string),
        image_url: ItemData.image_url,
        type: ItemData.type,
      },
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );

    onItemUpdated(res.data.menuItem);
    onClose();
  } catch (err: any) {
    alert(err.response?.data?.message || "Error updating item.");
  }
};


  return (
    <div className={style.background}>
      <div className={style.card}>
        <div className={style.header}>
          <h6 className={style.title}>Update Item</h6>
          <button className={style.closeBtn} onClick={onClose}>
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
              min="1"
              required
              value={ItemData.price}
              onChange={handleChange}
              className={style.input}
            />
          </div>

          <div className={style.section}>
            <label htmlFor="type" className={style.sectionLabel}>
              Category Name
            </label>
            <select
              id="type"
              required
              value={ItemData.type}
              onChange={handleChange}
              className={style.select}
            >
              <option value="">Select a category</option>
              <option value="meals">meals</option>
              <option value="appetizers">appetizers</option>
              <option value="drinks">drinks</option>
            </select>
          </div>

          <div className={style.section}>
            <label htmlFor="image_url" className={style.sectionLabel}>
              Choose Image
            </label>
            <input
              id="image_url"
              type="text"
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
              value={ItemData.description}
              onChange={handleChange}
              className={style.textarea }
            />
          </div>

          <div className={style.buttons}>
            <button type="submit" className={style.addbutton}>
              Update Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateMenuItem;
