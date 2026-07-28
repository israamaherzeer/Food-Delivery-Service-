import React from 'react';
import style from './MenuItemCard.module.css';
import type { MenuItem } from '../../types';



interface MenuItemCardProps {
  item: MenuItem;
  onDelete: (id: string) => void;
  onEdit: (item: MenuItem) => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onDelete,onEdit }) => {
  return (
    <div className={style.menuItemCard}>
      <div className={style.itemImageContainer}>
        <img src={item.image_url} alt={item.name} className={style.itemImage} />
      </div>
      <div className={style.itemContent}>
        <div className={style.itemHeader}>
          <h3 className={style.itemName}>{item.name}</h3>
          <span className={style.itemPrice}>{item.price} ₪</span>
        </div>
        <p className={style.itemDescription}>{item.description}</p>
      </div>
      <div className={style.itemActions}>
        {/* Edit Icon - Exact SVG from image */}
        <button className={style.editButton} onClick={() => onEdit(item)}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M17 3a2.828 2.828 0 0 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
          </svg>
        </button>
        {/* Delete Icon - Exact SVG from image */}
        <button
          className={style.deleteButton}
          onClick={() => onDelete(item._id)}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default MenuItemCard;