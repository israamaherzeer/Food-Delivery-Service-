import React, { useEffect, useState } from 'react';
import DashboardTopBar from '../DashboardTopBar/DashboardTopBar';
import MenuItemCard from '../MenuItemCard/MenuItemCard';
import style from './MenuManagementPage.module.css';
import type { MenuItem } from '../../types';
import AddmenuItem from '../AddMenuItem/addmenuItem';
import Notification from '../Notification/Notification';
import UpdateMenuItem from '../UpdateMenuItem/UpdateMenu';
import api from '../../src/api/axios';



const MenuManagementPage: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddVisible, setIsAddVisible] = useState(false);
    const [menuItemTodelete, setMenuItemTodelete] = useState<string | null>(
      null
  );
   const [menuItemToUpdate, setMenuItemToUpdate] = useState<MenuItem | null>(
     null
   );
   const handleEditMenuItem = (item: MenuItem) => {
     setMenuItemToUpdate(item);
   };
   const handleItemUpdated = (updatedItem: MenuItem) => {
     setMenuItems((prevItems) =>
       prevItems.map((item) =>
         item._id === updatedItem._id ? updatedItem : item
       )
     );
   };

  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
       const response = await api.get("/users/profile");

        const profileData = response.data.user;

        if (profileData && profileData.menuItems) {
          setMenuItems(profileData.menuItems);
        }
      } catch (error) {
        console.error("Error fetching profile/menu items:", error);
      }
    };

    fetchProfile();
  }, []);
  

const confirmDelete = async () => {
  if (!menuItemTodelete) return;

  try {
    await api.delete(`/menu-items/${menuItemTodelete}`);

    setMenuItems((prevItems) =>
      prevItems.filter((item) => item._id !== menuItemTodelete)
    );
    setMenuItemTodelete(null);
  } catch (error) {
    console.error("Error deleting menu item:", error);
  }
};


 const handleDeleteMenuItem = (id: string) => {
   setMenuItemTodelete(id);
 };
  
  const filteredMenuItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  
  return (
    <div className={style.pageContainer}>
      <DashboardTopBar userRole="restaurant" />
      <div className={style.contentWrapper}>
        <div className={style.headerSection}>
          <div className={style.searchContainer}>
            <svg
              className={style.searchIcon}
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Search menu items..."
              className={style.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            className={style.addMenuItemButton}
            onClick={() => setIsAddVisible(true)}
          >
            + Add Menu Item
          </button>
        </div>

        <div className={style.menuItemsGrid}>
          {filteredMenuItems.length === 0 ? (
            <p className={style.noItemsMessage}>No menu items found.</p>
          ) : (
            filteredMenuItems.map((item) => (
              <MenuItemCard
                key={item._id}
                item={item}
                onDelete={handleDeleteMenuItem}
                onEdit={handleEditMenuItem}
              />
            ))
          )}
        </div>
      </div>
      {isAddVisible && (
        <AddmenuItem
          onClose={() => setIsAddVisible(false)}
          onItemAdded={(newItem) => setMenuItems((prev) => [...prev, newItem])}
        />
      )}
      {menuItemTodelete && (
        <Notification
          isDelete={true}
          Name={
            "Are you sure you want to delete ? \n" +
            (menuItems.find((item) => item._id === menuItemTodelete)?.name || "")
          }
          onConfirm={confirmDelete}
          onCancel={() => setMenuItemTodelete(null)}
        />
      )}
      {menuItemToUpdate && (
        <UpdateMenuItem
          initialData={menuItemToUpdate}
          onClose={() => setMenuItemToUpdate(null)}
          onItemUpdated={handleItemUpdated}
        />
      )}
    </div>
  );
};

export default MenuManagementPage;


 