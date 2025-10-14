import Image from "next/image";
import styles from "./Footer.module.css";

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <p>&copy; 우아한테크코스 All Rights Reserved.</p>
      <p>
        <Image
          src="/images/woowacourse_logo.png"
          width={180}
          alt="우아한테크코스"
        />
      </p>
    </footer>
  );
};
