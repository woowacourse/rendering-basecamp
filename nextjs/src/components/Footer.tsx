import Image from "next/image";

export const Footer = () => {
  return (
    <footer className="footer">
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
