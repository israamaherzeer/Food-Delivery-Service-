import style from './Notification.module.css'

interface Iprops {
  Name: string;
  isDelete: boolean;
  onConfirm: () => void;
  onCancel: () => void;
   isSuccess?: boolean;

}

const Notification = (props: Iprops) => {
  return (
    <div className={style.background}>
      <div className={style.container}>
        <p className={style.noti} style={{ whiteSpace: "pre-line" }}>
         <img
  className={style.icon}
  src={
    props.isSuccess
      ? "https://cdn-icons-png.flaticon.com/512/845/845646.png"
      : "https://cdn-icons-png.flaticon.com/512/463/463612.png"
  }
  alt="alert"
/>
          {props.Name}
        </p>
        {props.isDelete && (
          <div className={style.buttonGroup}>
            <button className={style.cancle} onClick={props.onCancel}>
              Cancel
            </button>
            <button className={style.delete} onClick={props.onConfirm}>
              Delete
            </button>
          </div>
        )}
        {!props.isDelete && (
          <div className={style.buttonGroup}>
            <button className={style.delete} onClick={props.onConfirm}>
                OK
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notification;
